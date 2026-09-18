import type { ReactNode } from 'react'

type SkeletonProps = {
  className?: string
  children?: ReactNode
}

export function GlassSkeleton({ className = '', children }: SkeletonProps) {
  return (
    <div
      aria-hidden={children ? undefined : true}
      className={`glass skeleton-shimmer rounded-2xl border border-white/10 ${className}`}
    >
      {children}
    </div>
  )
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="page-enter mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-6 px-4">
      <GlassSkeleton className="h-12 w-12 rounded-full" />
      <div className="w-full space-y-3">
        <GlassSkeleton className="mx-auto h-4 w-2/3" />
        <GlassSkeleton className="mx-auto h-4 w-1/2" />
      </div>
      <p className="text-sm text-white/55">{label}</p>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center"
    >
      <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[420px] lg:h-[480px]">
        <div className="absolute inset-0 mx-auto my-auto h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.15)_0%,transparent_70%)] blur-3xl sm:h-[320px] sm:w-[320px]" />
        <GlassSkeleton className="h-[220px] w-[180px] rounded-[2rem] sm:h-[340px] sm:w-[260px]" />
      </div>
    </div>
  )
}

export function SectionFallback({
  height = '320px',
  cards = 3,
}: {
  height?: string
  cards?: number
}) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
      style={{ minHeight: height }}
    >
      <div className="mb-6 space-y-3">
        <GlassSkeleton className="h-4 w-28" />
        <GlassSkeleton className="h-8 w-full max-w-md" />
        <GlassSkeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <GlassSkeleton key={index} className="h-36 sm:h-44" />
        ))}
      </div>
    </div>
  )
}
