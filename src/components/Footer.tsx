import { Brain } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5 text-gold-soft" />
          <span className="font-semibold">MemoRoute</span>
        </div>
        <p className="text-center text-sm text-white/50">
          Adaptive Spaced Retention Learning System — SIH 2026
        </p>
        <div className="flex gap-4 text-sm text-white/60">
          <Link to="/login" className="hover:text-white">Login</Link>
          <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link to="/llm-payment" className="hover:text-white">LLM Payment</Link>
        </div>
      </div>
    </footer>
  )
}
