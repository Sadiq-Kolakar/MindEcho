export interface SubConceptScore {
  name: string
  covered: boolean
  score: number
}

export interface RetentionImpact {
  intervalDays: number
  reason: string
}

export interface FeynmanEvaluationResult {
  lectorScore: number
  correctness: number
  clarity: number
  completeness: number
  feedback: {
    strengths: string[]
    missingConcepts: string[]
    improvementTip: string
  }
  subConcepts: SubConceptScore[]
  misconceptions: string[]
  nextPrompt: string
  retentionImpact: RetentionImpact
}

export interface FeynmanEvaluationInput {
  sourceContent: string
  userExplanation: string
  topic: string
}

export interface LLMProvider {
  evaluateFeynman(input: FeynmanEvaluationInput): Promise<FeynmanEvaluationResult>
}
