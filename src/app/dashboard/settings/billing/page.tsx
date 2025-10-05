'use client'

import { useState, useEffect } from 'react'
import { CreditCard, ExternalLink, Check } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface Team {
  id: string
  name: string
  subscriptionStatus: string
  stripePriceId?: string
  stripeSubscriptionId?: string
}

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Perfect for individuals and small teams',
    features: ['Up to 5 team members', 'Basic authentication', 'Email support', '1GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Best for growing businesses',
    features: [
      'Up to 25 team members',
      'Advanced authentication',
      'Priority support',
      '10GB storage',
      'Advanced analytics',
      'Stripe integration',
      'Team management',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations',
    features: [
      'Unlimited team members',
      'SSO integration',
      '24/7 phone support',
      'Unlimited storage',
      'Custom analytics',
      'Advanced Stripe features',
      'Custom integrations',
    ],
  },
]

export default function BillingPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/teams/current')
      if (response.ok) {
        const data = await response.json()
        setTeam(data.team)
      }
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (priceId: string) => {
    setIsUpgrading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create customer portal session')
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const getCurrentPlan = () => {
    if (!team) return null

    if (team.subscriptionStatus === 'trialing' || team.subscriptionStatus === 'active') {
      return plans.find(plan => plan.id === 'pro') || plans[0]
    }

    return plans[0] // Default to starter
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-900/30 text-green-300',
      trialing: 'bg-fuchsia-900/30 text-fuchsia-300',
      canceled: 'bg-red-900/30 text-red-300',
      past_due: 'bg-yellow-900/30 text-yellow-300',
    }

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.trialing}`}
      >
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-black/30 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="grunge-paper p-6 rounded-lg">
              <div className="h-4 bg-black/30 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-black/30 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = getCurrentPlan()

  return (
    <div className="p-6 text-gray-200">
      {!process.env.STRIPE_SECRET_KEY && (
        <div className="mb-6 grunge-border bg-yellow-900/20 p-4 text-yellow-300">
          Stripe is in test mode or not configured. Set STRIPE_SECRET_KEY to enable live billing.
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl grunge-headline">Billing & Subscription</h1>
        <p className="text-gray-300 grunge-ink">Manage your subscription and billing settings</p>
      </div>

      {error && (
        <div className="mb-6 grunge-border bg-red-900/20 p-4 text-red-300">
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="space-y-8">
        {/* Current Subscription */}
        <div className="grunge-paper p-6 rounded-lg">
          <h2 className="text-lg grunge-headline mb-4">Current Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl grunge-headline">{currentPlan?.name} Plan</h3>
                {getStatusBadge(team?.subscriptionStatus || 'trialing')}
              </div>
              <p className="text-gray-300 mt-1">${currentPlan?.price}/month</p>
            </div>
            <div className="flex items-center space-x-4">
              {team?.stripeSubscriptionId && (
                <button
                  onClick={handleManageBilling}
                  className="inline-flex items-center px-4 py-2 grunge-border rounded-md text-sm font-medium text-gray-200 bg-black/40 hover:bg-black/60"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="grunge-paper p-6 rounded-lg" id="plans">
          <h2 className="text-lg grunge-headline mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const isCurrentPlan = currentPlan?.id === plan.id
              const isUpgrade = plan.price > (currentPlan?.price || 0)

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-lg grunge-border p-6 ${
                    isCurrentPlan ? 'bg-fuchsia-900/20' : 'bg-black/30'
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-3 py-1 text-xs font-semibold rounded-full">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl grunge-headline">{plan.name}</h3>
                    <p className="text-gray-300 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl grunge-headline">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-fuchsia-400 mr-3 mt-0.5" />
                        <span className="text-sm text-gray-200">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {isCurrentPlan ? (
                      <div className="w-full py-2 px-4 text-center text-sm text-fuchsia-300 bg-fuchsia-900/20 grunge-border rounded-md">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isUpgrading}
                        className={`w-full py-2 px-4 text-sm font-medium rounded-md grunge-border ${
                          isUpgrade
                            ? 'bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600'
                            : 'bg-black/40 text-gray-200 hover:bg-black/60'
                        } disabled:opacity-50`}
                      >
                        {isUpgrading ? 'Processing...' : isUpgrade ? 'Upgrade' : 'Downgrade'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Billing Information */}
        <div className="grunge-paper p-6 rounded-lg">
          <h2 className="text-lg grunge-headline mb-4">Billing Information</h2>
          {team?.stripeSubscriptionId ? (
            <div className="text-sm text-gray-300">
              <p>
                Manage your payment methods, view invoices, and update billing information through
                our secure billing portal.
              </p>
              <button
                onClick={handleManageBilling}
                className="mt-4 inline-flex items-center grunge-border px-4 py-2 text-purple-200 hover:text-white bg-black/40 hover:bg-black/60 rounded-md"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Open Billing Portal
                <ExternalLink className="h-4 w-4 ml-2" />
              </button>
            </div>
          ) : (
            <EmptyState
              icon={<CreditCard className="h-12 w-12" />}
              title="No billing on file"
              description="Start a subscription to manage billing, invoices, and payment methods."
              actionHref="#plans"
              actionLabel="Choose a plan"
            />
          )}
        </div>
      </div>
    </div>
  )
}
