import type { NoteItem, PracticeExplanation } from '../context/NotesContext'

export function todayDateStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatReviewIntervalLabel(intervalDays: number, studyMode: 'exam' | 'skill'): string {
  if (intervalDays <= 1) return 'Review tomorrow'
  if (studyMode === 'exam' && intervalDays <= 2) return `Accelerated (${intervalDays}d)`
  if (intervalDays <= 3) return `Short (${intervalDays} days)`
  if (intervalDays <= 7) return `Standard (${intervalDays} days)`
  return `Extended (${intervalDays} days)`
}

export function computeStudyStreak(explanations: PracticeExplanation[]): number {
  if (explanations.length === 0) return 0

  const daySet = new Set(
    explanations.map((item) => item.timestamp.slice(0, 10)).filter(Boolean),
  )

  let streak = 0
  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)

  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (!daySet.has(key)) break
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}

export function computeSessionsLast7Days(explanations: PracticeExplanation[]): number[] {
  const counts = Array.from({ length: 7 }, () => 0)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  for (const explanation of explanations) {
    const day = explanation.timestamp.slice(0, 10)
    if (!day) continue

    const diffMs = today.getTime() - new Date(`${day}T00:00:00.000Z`).getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays < 7) {
      counts[6 - diffDays] += 1
    }
  }

  return counts
}

export function computeRetentionBars(notes: NoteItem[]): number[] {
  if (notes.length === 0) return Array.from({ length: 30 }, () => 70)

  return Array.from({ length: 30 }, (_, index) => {
    const note = notes[index % notes.length]
    return note.retentionHealth ?? 70
  })
}

export function computeSubjectShares(notes: NoteItem[]): Array<{ name: string; count: number; share: number }> {
  if (notes.length === 0) return []

  const totals = new Map<string, number>()
  for (const note of notes) {
    totals.set(note.subject, (totals.get(note.subject) ?? 0) + 1)
  }

  return [...totals.entries()]
    .map(([name, count]) => ({
      name,
      count,
      share: count / notes.length,
    }))
    .sort((a, b) => b.count - a.count)
}

export function computeScoreDelta(explanations: PracticeExplanation[]): number {
  if (explanations.length < 2) return 0
  const latest = explanations[0].score
  const previous = explanations[1].score
  return Number((latest - previous).toFixed(2))
}
