import type { FeynmanEvaluationResult, SubConceptScore } from './llm-provider.js'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function computeLectorScore(correctness: number, clarity: number, completeness: number): number {
  return Number((correctness * 0.05 + clarity * 0.03 + completeness * 0.02).toFixed(1))
}

export function buildDefaultSubConcepts(topic: string, missingConcepts: string[]): SubConceptScore[] {
  if (missingConcepts.length === 0) {
    return [{ name: `${topic} core idea`, covered: true, score: 85 }]
  }

  return missingConcepts.slice(0, 4).map((name) => ({
    name,
    covered: false,
    score: 0,
  }))
}

export function applyLectorCalibration(
  result: FeynmanEvaluationResult,
  userExplanation: string,
): FeynmanEvaluationResult {
  const wordCount = userExplanation.trim().split(/\s+/).filter(Boolean).length
  let { correctness, clarity, completeness } = result

  if (wordCount < 15) {
    completeness = Math.min(completeness, 45)
    clarity = Math.min(clarity, 55)
  } else if (wordCount < 30) {
    completeness = Math.min(completeness, 65)
  }

  const subConcepts = result.subConcepts ?? []
  if (subConcepts.length > 0) {
    const coveredCount = subConcepts.filter((item) => item.covered).length
    const coverageRatio = coveredCount / subConcepts.length
    if (coverageRatio < 0.4) {
      completeness = Math.min(completeness, 50)
    } else if (coverageRatio < 0.7) {
      completeness = Math.min(completeness, 75)
    }
  }

  if ((result.misconceptions ?? []).length >= 2) {
    correctness = Math.min(correctness, 70)
  } else if ((result.misconceptions ?? []).length === 1) {
    correctness = Math.min(correctness, 82)
  }

  correctness = clamp(Math.round(correctness), 0, 100)
  clarity = clamp(Math.round(clarity), 0, 100)
  completeness = clamp(Math.round(completeness), 0, 100)

  const lectorScore = clamp(computeLectorScore(correctness, clarity, completeness), 1, 10)

  return {
    ...result,
    lectorScore,
    correctness,
    clarity,
    completeness,
    subConcepts,
    misconceptions: result.misconceptions ?? [],
    nextPrompt:
      result.nextPrompt ||
      `Explain ${result.feedback.missingConcepts[0] ?? 'the core idea'} in simple terms as if teaching a beginner.`,
    retentionImpact: result.retentionImpact ?? {
      intervalDays: lectorScore >= 8 ? 5 : lectorScore >= 6 ? 3 : 1,
      reason:
        lectorScore >= 8
          ? 'Strong explanation quality supports a longer review interval.'
          : 'Gaps detected — an earlier review is recommended.',
    },
  }
}
