import { useEffect, useState } from 'react'
import { fetchEvaluationAudioObjectUrl } from '../../lib/api/evaluations.api'

export function AuthenticatedAudioPlayer({ evaluationId }: { evaluationId: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null

    fetchEvaluationAudioObjectUrl(evaluationId)
      .then((url) => {
        objectUrl = url
        setSrc(url)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Audio unavailable')
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [evaluationId])

  if (error) {
    return <p className="text-xs text-rose-300">{error}</p>
  }

  if (!src) {
    return <p className="text-xs text-white/50">Loading audio…</p>
  }

  return <audio controls className="w-full" src={src} />
}
