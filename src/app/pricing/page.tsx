import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen grunge-bg">
      {/* Header */}
      <header className="grunge-border bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-700" />
              <span className="text-xl grunge-headline">SaaS Starter</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white grunge-ink">
                Home
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white grunge-ink">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 py-2 text-white hover:from-fuchsia-500 hover:to-purple-600"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-4 text-4xl grunge-headline md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 grunge-ink">
            Choose the plan that&apos;s right for your team
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl grunge-border p-8 ${
                    plan.popular ? 'bg-fuchsia-900/20 shadow-lg' : 'grunge-paper'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 py-1 text-sm font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl grunge-headline">{plan.name}</h3>
                    <p className="mt-2 text-gray-300 grunge-ink">{plan.description}</p>
                    <div className="mt-6">
                      <span className="text-5xl grunge-headline">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="mr-3 mt-0.5 h-5 w-5 text-fuchsia-400" />
                        <span className="text-gray-200 grunge-ink">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`mt-8 block w-full rounded-lg grunge-border py-3 text-center font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600'
                        : 'text-gray-200 hover:bg-black/30'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl grunge-headline">Feature Comparison</h2>
            <div className="overflow-hidden rounded-lg grunge-paper">
              <table className="w-full">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm grunge-headline">Feature</th>
                    <th className="px-6 py-4 text-center text-sm grunge-headline">Starter</th>
                    <th className="px-6 py-4 text-center text-sm grunge-headline">Pro</th>
                    <th className="px-6 py-4 text-center text-sm grunge-headline">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-200 grunge-ink">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {feature.starter ? (
                          <Check className="mx-auto h-5 w-5 text-fuchsia-400" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.pro ? (
                          <Check className="mx-auto h-5 w-5 text-fuchsia-400" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.enterprise ? (
                          <Check className="mx-auto h-5 w-5 text-fuchsia-400" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-8 py-16 text-center text-white">
            <h2 className="mb-4 text-4xl grunge-headline">Ready to Get Started?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of teams already building with SaaS Starter
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg grunge-border bg-white/95 px-8 py-4 text-lg font-semibold text-purple-700 hover:bg-white"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="grunge-border bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-r from-fuchsia-600 to-purple-700" />
              <span className="font-semibold grunge-headline">SaaS Starter</span>
            </div>
            <p className="text-gray-400">© 2024 SaaS Starter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: 0,
    popular: false,
    cta: 'Get Started Free',
    features: [
      'Up to 5 team members',
      'Basic authentication',
      'Email support',
      '1GB storage',
      'Basic analytics',
    ],
  },
  {
    name: 'Pro',
    description: 'Best for growing businesses',
    price: 29,
    popular: true,
    cta: 'Start Pro Trial',
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
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    popular: false,
    cta: 'Contact Sales',
    features: [
      'Unlimited team members',
      'SSO integration',
      '24/7 phone support',
      'Unlimited storage',
      'Custom analytics',
      'Advanced Stripe features',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

const comparisonFeatures = [
  { name: 'Team Members', starter: '5', pro: '25', enterprise: 'Unlimited' },
  { name: 'Authentication', starter: true, pro: true, enterprise: true },
  { name: 'Stripe Integration', starter: false, pro: true, enterprise: true },
  { name: 'Team Management', starter: false, pro: true, enterprise: true },
  { name: 'Activity Logging', starter: false, pro: true, enterprise: true },
  { name: 'Priority Support', starter: false, pro: true, enterprise: true },
  { name: 'SSO Integration', starter: false, pro: false, enterprise: true },
  { name: 'Custom Integrations', starter: false, pro: false, enterprise: true },
]
