import type { FeynmanEvaluationInput, FeynmanEvaluationResult, LLMProvider } from './llm-provider.js'
import { applyLectorCalibration } from './lector-calibration.service.js'

const LEVEL2_PROMPT_SUFFIX = `
Before scoring, extract 3-6 essential sub-concepts from the source notes.
Evaluate whether the student covered each sub-concept.
Detect misconceptions (factual errors, confused terms, circular reasoning).
Generate one targeted follow-up Feynman question for the weakest gap.

Return ONLY a valid raw JSON object (no markdown formatting, no code blocks) matching this strict schema:
{
  "lectorScore": number between 1.0 and 10.0,
  "correctness": integer 0-100,
  "clarity": integer 0-100,
  "completeness": integer 0-100,
  "feedback": {
    "strengths": [array of 1-3 concise string bullet points],
    "missingConcepts": [array of 0-3 string bullet points],
    "improvementTip": "1 concise actionable tip"
  },
  "subConcepts": [
    { "name": "sub-concept name", "covered": boolean, "score": integer 0-100 }
  ],
  "misconceptions": [array of 0-3 short strings, empty if none],
  "nextPrompt": "One specific Feynman follow-up question targeting the biggest gap",
  "retentionImpact": {
    "intervalDays": integer 1-14,
    "reason": "Short reason linking score quality to suggested review spacing"
  }
}

Scoring calibration rules:
- Penalize vague, generic, or overly short explanations (< 20 words) with lower completeness.
- Do not give scores above 8.5 unless most sub-concepts are covered with clear reasoning.
- Be strict about factual errors — reduce correctness when misconceptions exist.`

function parseLevel2Result(rawContent: string, topic: string): FeynmanEvaluationResult {
  const cleanedJson = rawContent.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleanedJson) as Partial<FeynmanEvaluationResult>

  return {
    lectorScore: Math.min(10, Math.max(1, Number(parsed.lectorScore || 8.5))),
    correctness: Math.min(100, Math.max(0, Math.round(Number(parsed.correctness || 85)))),
    clarity: Math.min(100, Math.max(0, Math.round(Number(parsed.clarity || 85)))),
    completeness: Math.min(100, Math.max(0, Math.round(Number(parsed.completeness || 85)))),
    feedback: {
      strengths: Array.isArray(parsed.feedback?.strengths)
        ? parsed.feedback.strengths
        : ['Good attempt explaining key concepts'],
      missingConcepts: Array.isArray(parsed.feedback?.missingConcepts)
        ? parsed.feedback.missingConcepts
        : [],
      improvementTip:
        parsed.feedback?.improvementTip || 'Keep practicing active recall in your own words.',
    },
    subConcepts: Array.isArray(parsed.subConcepts)
      ? parsed.subConcepts.map((item) => ({
          name: String(item.name || topic),
          covered: Boolean(item.covered),
          score: Math.min(100, Math.max(0, Math.round(Number(item.score || 0)))),
        }))
      : [],
    misconceptions: Array.isArray(parsed.misconceptions)
      ? parsed.misconceptions.map(String)
      : [],
    nextPrompt:
      parsed.nextPrompt ||
      `Explain the core idea of "${topic}" in simple terms as if teaching a beginner.`,
    retentionImpact: {
      intervalDays: Math.min(
        14,
        Math.max(1, Math.round(Number(parsed.retentionImpact?.intervalDays || 3))),
      ),
      reason:
        parsed.retentionImpact?.reason ||
        'Review interval suggested from explanation quality and sub-concept coverage.',
    },
  }
}

export class OpenAILLMProvider implements LLMProvider {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor(apiKey: string, baseUrl?: string, model?: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || 'https://api.openai.com/v1'
    this.model = model || 'gpt-4o-mini'
  }

  async evaluateFeynman(input: FeynmanEvaluationInput): Promise<FeynmanEvaluationResult> {
    const prompt = `You are LECTOR AI, an expert cognitive evaluator using the Feynman Technique to evaluate student comprehension.

SOURCE CONCEPT / TOPIC: "${input.topic}"
SOURCE NOTES CONTENT:
${input.sourceContent}

STUDENT EXPLANATION:
${input.userExplanation}

Evaluate the student's explanation against the source notes.
${LEVEL2_PROMPT_SUFFIX}`

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are LECTOR AI, an expert cognitive evaluator using the Feynman Technique. Always return strict valid JSON without markdown wrapping.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenAI API error (${response.status}): ${errText}`)
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const rawContent = data.choices?.[0]?.message?.content ?? ''

    try {
      const parsed = parseLevel2Result(rawContent, input.topic)
      return applyLectorCalibration(parsed, input.userExplanation)
    } catch {
      throw new Error(`Failed to parse LLM evaluation JSON response: ${rawContent}`)
    }
  }
}
