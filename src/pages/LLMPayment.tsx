import { motion } from 'framer-motion'
import { Check, CreditCard, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { Navbar } from '../components/Navbar'
import { ShinyButton } from '../components/ui/shiny-button'
import { useAuth } from '../context/AuthContext'

const plans = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '₹0',
    period: '/month',
    features: [
      '10 LECTOR evaluations/day',
      'Basic spaced repetition',
      'Text explanations only',
    ],
    icon: Sparkles,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹299',
    period: '/month',
    features: [
      'Unlimited LECTOR evaluations',
      'Voice + text explanations',
      'Exam Mode access',
      'Priority scheduling',
    ],
    icon: Zap,
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '₹999',
    period: '/month',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Admin dashboard',
      'API access for LECTOR',
    ],
    icon: CreditCard,
    popular: false,
  },
]

export function LLMPayment() {
  const { isAuthenticated } = useAuth()
  const [selected, setSelected] = useState('pro')
  const [saved, setSaved] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleSave = () => {
    localStorage.setItem('memoroute_llm_plan', selected)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1917] via-[#2a2421] to-[#14100e]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            LLM Payment Technique
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/65">
            Choose how you want to access LECTOR LLM evaluations. This section
            is a placeholder ready for your payment integration.
          </p>
        </motion.div>

        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setSelected(plan.id)}
                className="w-full text-left"
              >
                <GlassCard
                  className={`relative p-6 transition ${
                    selected === plan.id
                      ? 'ring-2 ring-gold-soft'
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-charcoal">
                      Popular
                    </span>
                  )}
                  <plan.icon className="mb-4 h-7 w-7 text-gold-soft" />
                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 mb-5">
                    <span className="text-3xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-white/50">{plan.period}</span>
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-white/70"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-soft" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>

        <GlassCard className="mx-auto max-w-lg p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Payment Method
          </h2>
          <div className="space-y-3">
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
              <CreditCard className="h-4 w-4 text-white/50" />
              <input
                placeholder="Card number (placeholder)"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="MM/YY"
                className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <input
                placeholder="CVV"
                className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>
          <ShinyButton
            label={saved ? 'Plan Saved ✓' : 'Save Plan Selection'}
            onClick={handleSave}
            accentColor="#e8c89b"
            accentSoftColor="#f5efe8"
            fillColor="#2b2421"
            cornerRadius={9999}
            className="mt-6 w-full py-3.5 text-sm font-semibold"
          />
          <Link
            to="/dashboard"
            className="mt-4 block text-center text-sm text-white/50 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </GlassCard>
      </main>
    </div>
  )
}
