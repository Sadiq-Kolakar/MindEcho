import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mic, FileText, Sparkles } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { Navbar } from '../components/Navbar'
import { AuthenticatedAudioPlayer } from '../components/dashboard/AuthenticatedAudioPlayer'
import { useApi } from '../lib/api/client'
import { listEvaluations, type EvaluationDetail } from '../lib/api/evaluations.api'
import { useAuth } from '../context/AuthContext'

export function EvaluationsPage() {
  const { isAuthenticated } = useAuth()
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'voice' | 'text'>('all')

  useEffect(() => {
    if (!useApi || !isAuthenticated) return

    setLoading(true)
    listEvaluations()
      .then(setEvaluations)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load evaluations'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const filtered = evaluations.filter((item) => filter === 'all' || item.mode === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1917] via-[#2a2421] to-[#14100e] text-[#f5efe8]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <Link to="/dashboard" className="mb-4 inline-flex text-xs font-semibold text-[#e8c89b] hover:underline">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white">Evaluation History</h1>
        <p className="mt-2 text-sm text-white/60">
          All stored Feynman explanations with LECTOR scores, transcripts, and voice replay.
        </p>

        <div className="mt-6 flex gap-2">
          {(['all', 'voice', 'text'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${
                filter === mode
                  ? 'bg-[#e8c89b] text-[#1e1917]'
                  : 'border border-white/15 text-white/70'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-sm text-white/50">Loading evaluations…</p>}
        {error && <p className="mt-8 text-sm text-rose-300">{error}</p>}

        <div className="mt-8 space-y-4">
          {filtered.map((item) => (
            <GlassCard key={item.id} dark className="border border-white/15 p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {item.mode === 'voice' ? (
                    <Mic className="h-4 w-4 text-[#e8c89b]" />
                  ) : (
                    <FileText className="h-4 w-4 text-[#e8c89b]" />
                  )}
                  <span className="text-lg font-bold text-white">{item.lectorScore}/10</span>
                  <span className="text-xs text-white/50">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <span className="rounded-full bg-[#e8c89b]/15 px-3 py-1 text-[10px] font-bold text-[#e8c89b] uppercase">
                  {item.mode}
                </span>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-white/5 p-2">Correctness: {item.correctness}%</div>
                <div className="rounded-xl bg-white/5 p-2">Clarity: {item.clarity}%</div>
                <div className="rounded-xl bg-white/5 p-2">Completeness: {item.completeness}%</div>
              </div>

              {item.transcript && (
                <p className="mb-3 text-sm leading-relaxed text-white/75 whitespace-pre-wrap">{item.transcript}</p>
              )}

              {item.subConcepts?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {item.subConcepts.map((sub) => (
                    <span
                      key={sub.name}
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        sub.covered ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
                      }`}
                    >
                      {sub.name} ({sub.score}%)
                    </span>
                  ))}
                </div>
              )}

              {item.nextPrompt && (
                <p className="mb-3 flex items-start gap-2 text-xs text-blue-200">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{item.nextPrompt}</span>
                </p>
              )}

              {item.audioUrl && <AuthenticatedAudioPlayer evaluationId={item.id} />}
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  )
}
