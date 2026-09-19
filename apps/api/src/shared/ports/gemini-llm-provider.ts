import type { FeynmanEvaluationInput, FeynmanEvaluationResult, LLMProvider } from './llm-provider.js'
import { applyLectorCalibration } from './lector-calibration.service.js'

const LEVEL2_PROMPT_SUFFIX = `
Extract 3-6 essential sub-concepts from the source notes and score coverage for each.
Detect misconceptions. Generate one targeted follow-up Feynman question.

Return ONLY a raw JSON object with:
{
  "lectorScore": number 1.0 to 10.0,
  "correctness": integer 0-100,
  "clarity": integer 0-100,
  "completeness": integer 0-100,
  "feedback": { "strengths": ["string"], "missingConcepts": ["string"], "improvementTip": "string" },
  "subConcepts": [{ "name": "string", "covered": boolean, "score": integer 0-100 }],
  "misconceptions": ["string"],
  "nextPrompt": "string",
  "retentionImpact": { "intervalDays": integer 1-14, "reason": "string" }
}

Be strict: short vague answers should score lower completeness. Factual errors reduce correctness.`

function parseLevel2Result(rawContent: string, topic: string): FeynmanEvaluationResult {
  const cleanedJson = rawContent.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleanedJson) as Partial<FeynmanEvaluationResult>

  return {
    lectorScore: Math.min(10, Math.max(1, Number(parsed.lectorScore || 8.5))),
    correctness: Math.min(100, Math.max(0, Math.round(Number(parsed.correctness || 85)))),
    clarity: Math.min(100, Math.max(0, Math.round(Number(parsed.clarity || 85)))),
    completeness: Math.min(100, Math.max(0, Math.round(Number(parsed.completeness || 85)))),
    feedback: {
      strengths: Array.isArray(parsed.feedback?.strengths) ? parsed.feedback.strengths : ['Clear explanation'],
      missingConcepts: Array.isArray(parsed.feedback?.missingConcepts) ? parsed.feedback.missingConcepts : [],
      improvementTip: parsed.feedback?.improvementTip || 'Keep practicing simple explanations.',
    },
    subConcepts: Array.isArray(parsed.subConcepts)
      ? parsed.subConcepts.map((item) => ({
          name: String(item.name || topic),
          covered: Boolean(item.covered),
          score: Math.min(100, Math.max(0, Math.round(Number(item.score || 0)))),
        }))
      : [],
    misconceptions: Array.isArray(parsed.misconceptions) ? parsed.misconceptions.map(String) : [],
    nextPrompt:
      parsed.nextPrompt || `Explain the core idea of "${topic}" in simple terms as if teaching a beginner.`,
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

export class GeminiLLMProvider implements LLMProvider {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey
    this.model = model || 'gemini-1.5-flash'
  }

  async evaluateFeynman(input: FeynmanEvaluationInput): Promise<FeynmanEvaluationResult> {
    const prompt = `You are LECTOR AI, an expert cognitive evaluator using the Feynman Technique.

SOURCE CONCEPT / TOPIC: "${input.topic}"
SOURCE NOTES CONTENT:
${input.sourceContent}

STUDENT EXPLANATION:
${input.userExplanation}

Evaluate the student's explanation against the source notes.
${LEVEL2_PROMPT_SUFFIX}`

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini API error (${response.status}): ${errText}`)
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }

    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    try {
      const parsed = parseLevel2Result(rawContent, input.topic)
      return applyLectorCalibration(parsed, input.userExplanation)
    } catch {
      throw new Error(`Failed to parse Gemini LLM evaluation JSON response: ${rawContent}`)
    }
  }
}
