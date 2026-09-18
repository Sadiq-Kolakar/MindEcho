import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useApi } from '../lib/api/client'
import {
  checkoutSubscription,
  fetchCurrentSubscription,
  type CurrentSubscription,
} from '../lib/api/subscriptions.api'
import { useAuth } from './AuthContext'

interface SubscriptionContextValue {
  subscription: CurrentSubscription | null
  isLoading: boolean
  voiceEnabled: boolean
  refreshSubscription: () => Promise<void>
  upgradePlan: (planId: string, billingCycle?: 'monthly' | 'annual') => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const apiMode = useApi && isAuthenticated
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshSubscription = useCallback(async () => {
    if (!apiMode) {
      setSubscription(null)
      return
    }

    setIsLoading(true)
    try {
      const current = await fetchCurrentSubscription()
      setSubscription(current)
    } catch {
      setSubscription(null)
    } finally {
      setIsLoading(false)
    }
  }, [apiMode])

  useEffect(() => {
    void refreshSubscription()
  }, [refreshSubscription])

  const upgradePlan = useCallback(
    async (planId: string, billingCycle: 'monthly' | 'annual' = 'monthly') => {
      if (!apiMode) return
      await checkoutSubscription({
        planId,
        billingCycle,
        paymentToken: 'tok_mock_card_1234',
      })
      await refreshSubscription()
    },
    [apiMode, refreshSubscription],
  )

  const voiceEnabled = useMemo(() => {
    if (!apiMode) return true
    if (!subscription) return false
    return subscription.planId !== 'starter'
  }, [apiMode, subscription])

  const value = useMemo(
    () => ({
      subscription,
      isLoading,
      voiceEnabled,
      refreshSubscription,
      upgradePlan,
    }),
    [subscription, isLoading, voiceEnabled, refreshSubscription, upgradePlan],
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
