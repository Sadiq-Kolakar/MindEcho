import type { EvaluationDocument } from '../../models/Evaluation.js'
import { toPublicEvalId } from '../../shared/utils/eval-id.js'
import { toPublicNoteId } from '../../shared/utils/note-id.js'
import type { EvaluationDetailResponse } from './evaluations.schemas.js'

export function serializeEvaluationDetail(evaluation: EvaluationDocument): EvaluationDetailResponse {
  return {
    id: toPublicEvalId(evaluation._id),
    noteId: toPublicNoteId(evaluation.noteId),
    mode: evaluation.mode as 'voice' | 'text',
    ...(evaluation.transcript ? { transcript: evaluation.transcript } : {}),
    ...(evaluation.selfRating != null ? { selfRating: evaluation.selfRating } : {}),
    lectorScore: evaluation.lectorScore,
    correctness: evaluation.correctness,
    clarity: evaluation.clarity,
    completeness: evaluation.completeness,
    feedback: {
      strengths: evaluation.feedback.strengths,
      missingConcepts: evaluation.feedback.missingConcepts,
      improvementTip: evaluation.feedback.improvementTip,
    },
    subConcepts: (evaluation.subConcepts ?? []).map((item) => ({
      name: item.name,
      covered: item.covered,
      score: item.score,
    })),
    misconceptions: evaluation.misconceptions ?? [],
    ...(evaluation.nextPrompt ? { nextPrompt: evaluation.nextPrompt } : {}),
    ...(evaluation.retentionImpact
      ? {
          retentionImpact: {
            intervalDays: evaluation.retentionImpact.intervalDays,
            reason: evaluation.retentionImpact.reason,
          },
        }
      : {}),
    ...(evaluation.audioUrl ? { audioUrl: evaluation.audioUrl } : {}),
    createdAt: evaluation.createdAt.toISOString(),
  }
}
