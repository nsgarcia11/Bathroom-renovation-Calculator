'use client'

import { createContext, useContext } from 'react'
import { useSubscription as useSubscriptionQuery, useHasActiveSubscription } from '@/hooks/use-subscription'

interface SubscriptionContextType {
  subscription: ReturnType<typeof useSubscriptionQuery>['data']
  hasActiveSubscription: boolean
  loading: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: subscription, isLoading: loading } = useSubscriptionQuery()
  const hasActiveSubscription = useHasActiveSubscription()

  return (
    <SubscriptionContext.Provider value={{ subscription, hasActiveSubscription, loading }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
