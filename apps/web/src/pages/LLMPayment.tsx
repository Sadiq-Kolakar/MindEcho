import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { Navbar } from '../components/Navbar'
import { PricingSection } from '../components/ui/pricing'
import { ShinyButton } from '../components/ui/shiny-button'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import { useApi } from '../lib/api/client'
import { fetchPlans, type SubscriptionPlan } from '../lib/api/subscriptions.api'

export function LLMPayment() {
  const { isAuthenticated } = useAuth()
  const { subscription, upgradePlan, refreshSubscription } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiPlans, setApiPlans] = useState<SubscriptionPlan[]>([])

  useEffect(() => {
    if (subscription?.planId) {
      setSelectedPlan(subscription.planId)
    }
  }, [subscription?.planId])

  useEffect(() => {
    if (!useApi) return
    fetchPlans().then(setApiPlans).catch(() => {})
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleCheckout = async (planId: string) => {
    setError(null)
    setSelectedPlan(planId)

    if (useApi) {
      try {
        await upgradePlan(planId)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed')
      }
      return
    }

    localStorage.setItem('memoroute_llm_plan', planId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const plans = (apiPlans.length > 0
    ? apiPlans.map((plan) => ({
        name: plan.name,
        price: String(plan.monthlyPrice),
        yearlyPrice: String(plan.annualPrice),
        period: 'month',
        features: [
          plan.dailyEvaluationLimit
            ? `${plan.dailyEvaluationLimit} LECTOR evaluations/day`
            : 'Unlimited LECTOR evaluations',
          plan.voiceEnabled ? 'Voice + text explanations' : 'Text explanations only',
          plan.examMode === 'full' ? 'Full exam mode compression' : 'Basic spaced repetition',
        ],
        description: plan.description,
        buttonText: selectedPlan === plan.id ? 'Selected Plan' : `Select ${plan.name}`,
        href: '#',
        isPopular: plan.id === 'pro',
        onSelect: () => void handleCheckout(plan.id),
      }))
    : [
        {
          name: 'Starter',
          price: '0',
          yearlyPrice: '0',
          period: 'month',
          features: ['10 LECTOR AI evaluations/day', 'Text explanations only'],
          description: 'Perfect for individual learners & light practice.',
          buttonText: selectedPlan === 'starter' ? 'Selected Plan' : 'Select Starter',
          href: '#',
          onSelect: () => void handleCheckout('starter'),
        },
        {
          name: 'Pro Mastery',
          price: '299',
          yearlyPrice: '239',
          period: 'month',
          features: ['Unlimited LECTOR evaluations', 'Voice + text explanations'],
          description: 'Ideal for students preparing for major exams.',
          buttonText: selectedPlan === 'pro' ? 'Selected Plan' : 'Select Pro Mastery',
          href: '#',
          isPopular: true,
          onSelect: () => void handleCheckout('pro'),
        },
      ])

  return (
    <div className="theme-page-solid min-h-screen text-white">
      <Navbar />

      <div className="pt-20">
        <PricingSection
          plans={plans}
          title="Find the Perfect Plan for LECTOR AI"
          description={`Choose the plan that fits your study pace.\nCurrent Plan: ${(subscription?.planId ?? selectedPlan).toUpperCase()}`}
        />
      </div>

      <main className="mx-auto max-w-xl px-4 pb-20">
        <GlassCard dark className="p-8 border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#e8c89b]" />
              Payment Method &amp; Checkout
            </h2>
            <span className="rounded-full bg-[#e8c89b]/20 px-3 py-0.5 text-xs font-bold text-[#e8c89b]">
              Active: {(subscription?.planId ?? selectedPlan).toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-white/60 mb-6">
            {useApi
              ? 'Mock checkout activates your plan instantly in development. Voice unlocks on Pro or Team.'
              : 'Development demo mode saves plan selection locally.'}
          </p>

          {subscription && (
            <p className="mb-4 text-xs text-white/70">
              Evaluations today: {subscription.usage.evaluationsToday}
              {subscription.usage.dailyLimit != null ? ` / ${subscription.usage.dailyLimit}` : ' (unlimited)'}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleCheckout(selectedPlan)
            }}
            className="space-y-4"
          >
            {error && <p className="text-xs text-rose-300">{error}</p>}

            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-center text-xs font-semibold text-emerald-300"
              >
                Plan updated successfully!
              </motion.div>
            )}

            <ShinyButton
              type="submit"
              label={saved ? 'Plan Saved' : 'Confirm Plan Checkout'}
              accentColor="#e8c89b"
              accentSoftColor="#f5efe8"
              fillColor="#2b2421"
              cornerRadius={9999}
              className="mt-4 w-full py-3.5 text-sm font-semibold"
            />

            {useApi && (
              <button
                type="button"
                onClick={() => void refreshSubscription()}
                className="w-full text-xs text-white/50 hover:text-white"
              >
                Refresh subscription status
              </button>
            )}
          </form>

          <Link
            to="/dashboard"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </GlassCard>
      </main>
    </div>
  )
}

export default LLMPayment
