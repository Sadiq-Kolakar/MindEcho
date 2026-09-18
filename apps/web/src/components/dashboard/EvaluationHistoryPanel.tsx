import { useEffect, useState } from 'react'
import { Mic, FileText } from 'lucide-react'
import { GlassCard } from '../GlassCard'
import { AuthenticatedAudioPlayer } from './AuthenticatedAudioPlayer'
import { useApi } from '../../lib/api/client'
import { listEvaluations, type EvaluationDetail } from '../../lib/api/evaluations.api'
import { useAuth } from '../../context/AuthContext'

export function EvaluationHistoryPanel() {
  const { isAuthenticated } = useAuth()
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!useApi || !isAuthenticated) return

    setLoading(true)
    listEvaluations()
      .then(setEvaluations)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!useApi) return null

  return (
    <GlassCard dark className="mt-8 p-6 border border-white/15">
      <h2 className="mb-1 text-lg font-bold text-white">Evaluation History</h2>
      <p className="mb-4 text-xs text-white/60">
        Stored Feynman explanations with transcripts and voice replay.
      </p>

      {loading && <p className="text-sm text-white/50">Loading evaluations…</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}

      {!loading && evaluations.length === 0 && (
        <p className="text-sm text-white/50">No evaluations yet. Complete a Feynman session to see history here.</p>
      )}

      <div className="space-y-3">
        {evaluations.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/80">
                {item.mode === 'voice' ? (
                  <Mic className="h-3.5 w-3.5 text-[#e8c89b]" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-[#e8c89b]" />
                )}
                <span className="font-semibold text-white">{item.lectorScore}/10</span>
                <span className="text-white/50">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <span className="rounded-full bg-[#e8c89b]/15 px-2 py-0.5 text-[10px] font-bold text-[#e8c89b]">
                {item.mode}
              </span>
            </div>

            {item.transcript && (
              <p className="mb-2 line-clamp-3 leading-relaxed text-white/70">{item.transcript}</p>
            )}

            {item.subConcepts?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {item.subConcepts.slice(0, 4).map((sub) => (
                  <span
                    key={sub.name}
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      sub.covered ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
                    }`}
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            )}

            {item.audioUrl && <AuthenticatedAudioPlayer evaluationId={item.id} />}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
