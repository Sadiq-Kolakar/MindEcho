import { lazy, Suspense, useEffect, useState } from 'react'

const AnimatedCharacter = lazy(() =>
  import('./AnimatedCharacter').then((module) => ({ default: module.AnimatedCharacter })),
)

function CharacterPlaceholder() {
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center">
      <div className="glass-strong relative z-30 mb-2 w-full max-w-md rounded-2xl border border-[#e8c89b]/30 px-5 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-[#e8c89b]/20" />
        <div className="mt-3 h-10 w-full animate-pulse rounded bg-white/10" />
      </div>
      <div className="relative flex h-[480px] w-full items-center justify-center sm:h-[540px]">
        <div className="absolute inset-0 mx-auto my-auto h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.2)_0%,transparent_70%)] blur-3xl" />
        <img
          src="/hero-character.png"
          alt="Samuel AI assistant"
          className="relative z-10 h-[420px] w-auto object-contain drop-shadow-2xl"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}

export function DeferredAnimatedCharacter() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setReady(true), { timeout: 1200 })
      return () => win.cancelIdleCallback?.(id)
    }

    const timer = window.setTimeout(() => setReady(true), 600)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ready) {
    return <CharacterPlaceholder />
  }

  return (
    <Suspense fallback={<CharacterPlaceholder />}>
      <AnimatedCharacter />
    </Suspense>
  )
}
