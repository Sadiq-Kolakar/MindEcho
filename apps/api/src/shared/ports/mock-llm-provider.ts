import type { FeynmanEvaluationInput, FeynmanEvaluationResult, LLMProvider } from './llm-provider.js'
import { applyLectorCalibration, buildDefaultSubConcepts } from './lector-calibration.service.js'

function extractKeywords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 4),
  )
}

export class MockLLMProvider implements LLMProvider {
  async evaluateFeynman(input: FeynmanEvaluationInput): Promise<FeynmanEvaluationResult> {
    const explanation = input.userExplanation.trim()
    const wordCount = explanation.split(/\s+/).filter(Boolean).length
    const sourceKeywords = extractKeywords(input.sourceContent)
    const explanationKeywords = extractKeywords(explanation)
    const overlap = [...sourceKeywords].filter((word) => explanationKeywords.has(word)).length
    const coverageRatio = sourceKeywords.size > 0 ? overlap / sourceKeywords.size : 0

    const correctness = Math.min(97, Math.round(70 + coverageRatio * 30))
    const clarity = Math.min(95, Math.round(65 + Math.min(wordCount, 40) * 0.75))
    const completeness = Math.min(96, Math.round(60 + coverageRatio * 40))

    const missingConcepts =
      wordCount < 20
        ? ['Explanation was too short for full coverage']
        : coverageRatio < 0.3
          ? ['Several core concepts from the source note were not mentioned']
          : []

    const raw: FeynmanEvaluationResult = {
      lectorScore: 0,
      correctness,
      clarity,
      completeness,
      feedback: {
        strengths:
          overlap > 0
            ? [`Covered ${overlap} key concepts from your notes`, 'Clear attempt at simplifying the topic']
            : ['Good effort starting the explanation'],
        missingConcepts,
        improvementTip:
          coverageRatio < 0.5
            ? 'Re-read your notes and try explaining the topic again in simpler words.'
            : 'Practice explaining edge cases and real-world examples out loud.',
      },
      subConcepts: buildDefaultSubConcepts(input.topic, missingConcepts),
      misconceptions: wordCount < 10 ? ['Explanation too brief to verify understanding'] : [],
      nextPrompt: `Explain the most important idea in "${input.topic}" without using jargon.`,
      retentionImpact: {
        intervalDays: completeness >= 80 ? 5 : 2,
        reason: 'Mock evaluator interval estimate based on completeness.',
      },
    }

    return applyLectorCalibration(raw, explanation)
  }
}
