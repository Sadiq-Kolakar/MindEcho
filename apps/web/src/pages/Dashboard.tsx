import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LearningDashboardGrid } from '../components/dashboard/LearningDashboardGrid'
import { EvaluationHistoryPanel } from '../components/dashboard/EvaluationHistoryPanel'
import { Navbar } from '../components/Navbar'
import { ShinyButton } from '../components/ui/shiny-button'
import { useAuth } from '../context/AuthContext'

export function Dashboard() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="theme-page min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1180px] px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-white/65">
            Welcome back, {user?.name}! Track your learning progress with
            LECTOR scores and spaced repetition.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <ShinyButton
              label="Start New Concept +"
              onClick={() => navigate('/concept/new')}
              accentColor="#e8c89b"
              accentSoftColor="#f5efe8"
              fillColor="#2b2421"
              cornerRadius={9999}
              className="px-5 py-2.5 text-xs font-semibold"
            />
            <button
              onClick={() => navigate('/calendar')}
              className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-[#e8c89b] transition hover:bg-[#e8c89b]/20 hover:border-[#e8c89b] flex items-center gap-2 border border-[#e8c89b]/30 bg-[#e8c89b]/10"
            >
              <span>Review Due Items &amp; Adaptive Calendar</span>
            </button>
            <Link
              to="/evaluations"
              className="glass rounded-full px-5 py-2.5 text-sm text-white/90 transition hover:bg-[#e8c89b]/20 hover:border-[#e8c89b] hover:text-[#e8c89b] font-semibold"
            >
              Evaluation History
            </Link>
            <Link
              to="/subjects"
              className="glass rounded-full px-5 py-2.5 text-sm text-white/90 transition hover:bg-[#e8c89b]/20 hover:border-[#e8c89b] hover:text-[#e8c89b] font-semibold"
            >
              Subjects &amp; Notes
            </Link>
          </div>
        </motion.div>

        <LearningDashboardGrid />
        <EvaluationHistoryPanel />
      </main>
    </div>
  )
}
