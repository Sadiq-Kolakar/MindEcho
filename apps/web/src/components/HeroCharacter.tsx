import { lazy, Suspense, useEffect, useState } from 'react'
import { Bot } from 'lucide-react'
import { AIBotModal } from './AIBotModal'
import { GlassSkeleton } from './ui/page-loader'

const SplineScene = lazy(() =>
  import('./ui/splite').then((module) => ({ default: module.SplineScene })),
)

const SAMUEL_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export function HeroCharacter() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showRobot, setShowRobot] = useState(false)
  const [robotReady, setRobotReady] = useState(false)

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setShowRobot(true), { timeout: 800 })
      return () => win.cancelIdleCallback?.(id)
    }

    const timer = window.setTimeout(() => setShowRobot(true), 300)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open Samuel AI assistant"
        className="group relative mx-auto block w-full max-w-xl select-none"
      >
        <div className="spline-robot-viewport relative mx-auto h-[300px] w-full overflow-hidden sm:h-[420px] lg:h-[480px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mx-auto my-auto h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.28)_0%,rgba(232,200,155,0.1)_50%,transparent_75%)] blur-3xl transition-transform duration-500 group-hover:scale-110 sm:h-[340px] sm:w-[340px]"
          />

          {!robotReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
              <GlassSkeleton className="flex h-28 w-28 items-center justify-center rounded-full sm:h-36 sm:w-36">
                <Bot className="h-10 w-10 text-[#e8c89b]/70 sm:h-12 sm:w-12" />
              </GlassSkeleton>
              <GlassSkeleton className="h-3 w-32" />
            </div>
          )}

          {showRobot && (
            <div
              className={`absolute inset-0 z-20 scale-[0.88] transition-opacity duration-500 sm:scale-95 ${
                robotReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Suspense fallback={null}>
                <SplineScene
                  scene={SAMUEL_SCENE}
                  className="h-full w-full"
                  onLoad={() => setRobotReady(true)}
                />
              </Suspense>
            </div>
          )}
        </div>
      </button>

      <AIBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
