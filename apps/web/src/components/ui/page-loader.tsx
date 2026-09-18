export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="page-enter flex min-h-[50vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#e8c89b]/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#e8c89b]" />
        </div>
        <p className="text-sm text-white/60">{label}</p>
      </div>
    </div>
  )
}

export function SectionFallback({ height = '320px' }: { height?: string }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6"
      style={{ minHeight: height }}
    >
      <div className="h-full rounded-3xl bg-white/5" />
    </div>
  )
}
