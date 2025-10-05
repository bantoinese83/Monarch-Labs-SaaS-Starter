import Link from 'next/link'
import dynamic from 'next/dynamic'

export const revalidate = 3600
import { ArrowRight, Check, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl grunge-headline md:text-6xl">
              Raw & Unfiltered
              <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                SaaS
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 grunge-ink">
              A complete Next.js starter template with authentication, payments, team management,
              and everything you need to launch your SaaS product.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="flex items-center rounded-lg grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-8 py-4 text-lg font-semibold text-white hover:from-fuchsia-500 hover:to-purple-600"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg grunge-border px-8 py-4 text-lg font-semibold text-gray-200 hover:bg-black/30"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Terminal (dynamically loaded) */}
      {(() => {
        const Terminal = dynamic(async () => {
          return function Terminal() {
            return (
              <section className="py-16">
                <div className="mx-auto max-w-6xl px-4">
                  <div className="mx-auto max-w-4xl">
                    <div className="overflow-hidden rounded-lg grunge-paper">
                      <div className="flex items-center space-x-2 bg-black/50 px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-sm text-gray-400 grunge-ink">Terminal</span>
                      </div>
                      <div className="p-6 font-mono text-sm text-green-400">
                        <div className="animate-pulse">
                          <div className="mb-2">
                            $ git clone https://github.com/bantoinese83/Monarch-Labs-SaaS-Starter.git my-saas
                          </div>
                          <div className="mb-2">$ cd my-saas</div>
                          <div className="mb-2">$ npm run setup</div>
                          <div className="text-blue-400">✓ Dependencies installed</div>
                          <div className="text-blue-400">✓ Environment configured</div>
                          <div className="text-blue-400">✓ Database setup</div>
                          <div className="text-blue-400">✓ Tests passed</div>
                          <div className="text-green-400">✓ Ready to code!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          }
        })
        return <Terminal />
      })()}

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="mb-4 text-4xl grunge-headline">Everything You Need</h2>
            <p className="mb-16 text-xl text-gray-300 grunge-ink">
              Built with modern technologies and best practices
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg grunge-paper p-6 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fuchsia-900/30 grunge-border">
                  <feature.icon className="h-6 w-6 text-fuchsia-400" />
                </div>
                <h3 className="mb-2 text-xl grunge-headline">{feature.title}</h3>
                <p className="text-gray-300 grunge-ink">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-8 py-16 text-center text-white">
            <h2 className="mb-4 text-4xl grunge-headline">Ready to Build Your SaaS?</h2>
            <p className="mb-8 text-xl opacity-90">
              Get started in minutes with our complete starter template
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg grunge-border bg-white/95 px-8 py-4 text-lg font-semibold text-purple-700 hover:bg-white"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Star,
    title: 'Authentication',
    description: 'Secure email/password auth with JWT tokens and role-based access control.',
  },
  {
    icon: Check,
    title: 'Stripe Integration',
    description: 'Complete payment processing with subscription management and customer portal.',
  },
  {
    icon: ArrowRight,
    title: 'Team Management',
    description: 'Multi-tenant architecture with team-based organization and member management.',
  },
  {
    icon: Star,
    title: 'Activity Logging',
    description: 'Comprehensive audit trail for all user actions and system events.',
  },
  {
    icon: Check,
    title: 'Modern Stack',
    description:
      'Next.js 15, React 19, TypeScript, Tailwind CSS, and Prisma for the best developer experience.',
  },
  {
    icon: ArrowRight,
    title: 'Production Ready',
    description: 'Deployed on Vercel with Supabase database and optimized for performance.',
  },
]
