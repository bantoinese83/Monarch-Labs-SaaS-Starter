import Link from 'next/link'
import dynamic from 'next/dynamic'
import { generatePageMetadata, pageOGConfigs } from '@/lib/og-image'
import {
  generateBreadcrumbStructuredData,
  generateSoftwareApplicationStructuredData,
} from '@/lib/seo'

export const revalidate = 3600
import { ArrowRight, Check, Star } from 'lucide-react'

// Generate metadata for the homepage
export const metadata = generatePageMetadata(pageOGConfigs.home)

export default function HomePage() {
  const breadcrumbData = generateBreadcrumbStructuredData([{ name: 'Home', url: '/' }])

  const softwareData = generateSoftwareApplicationStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareData),
        }}
      />
      <div className="w-full">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl grunge-headline text-balance">
              Raw & Unfiltered
              <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                SaaS
              </span>
            </h1>
            <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-gray-300 grunge-ink text-balance max-w-3xl mx-auto">
              A complete Next.js starter template with authentication, payments, team management,
              100% mobile responsive design, full SEO coverage, and dynamic OpenGraph images.
            </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto flex items-center justify-center rounded-lg grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:from-fuchsia-500 hover:to-purple-600 min-touch-target transition-all duration-200 hover:scale-105"
                >
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto rounded-lg grunge-border px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-200 hover:bg-black/30 min-touch-target transition-all duration-200 text-center"
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
                <section className="py-8 sm:py-12 lg:py-16">
                  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                      <div className="overflow-hidden rounded-lg grunge-paper">
                        <div className="flex items-center space-x-2 bg-black/50 px-3 sm:px-4 py-2 sm:py-3">
                          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                          <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                          <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-400 grunge-ink">
                            Terminal
                          </span>
                        </div>
                        <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto">
                          <div className="animate-pulse">
                            <div className="mb-1 sm:mb-2 break-all">
                              $ git clone
                              https://github.com/bantoinese83/Monarch-Labs-SaaS-Starter.git my-saas
                            </div>
                            <div className="mb-1 sm:mb-2">$ cd my-saas</div>
                            <div className="mb-1 sm:mb-2">$ npm run setup</div>
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
        <section id="features" className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl grunge-headline text-balance">
                Everything You Need
              </h2>
              <p className="mb-8 sm:mb-12 lg:mb-16 text-lg sm:text-xl text-gray-300 grunge-ink text-balance max-w-2xl mx-auto">
                Built with modern technologies and best practices
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-lg grunge-paper p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-fuchsia-900/30 grunge-border">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-fuchsia-400" />
                  </div>
                  <h3 className="mb-2 text-lg sm:text-xl grunge-headline text-balance">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 grunge-ink text-balance">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center text-white">
              <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl grunge-headline text-balance">
                Ready to Build Your SaaS?
              </h2>
              <p className="mb-6 sm:mb-8 text-lg sm:text-xl opacity-90 text-balance max-w-2xl mx-auto">
                Get started in minutes with our complete starter template
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg grunge-border bg-white/95 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-purple-700 hover:bg-white min-touch-target transition-all duration-200 hover:scale-105"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
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
    title: 'Mobile Responsive',
    description: '100% mobile responsive design with touch-friendly interactions and safe area handling.',
  },
  {
    icon: Check,
    title: 'SEO Optimized',
    description: 'Full SEO coverage with meta tags, structured data, sitemap, and dynamic OpenGraph images.',
  },
  {
    icon: ArrowRight,
    title: 'Performance Ready',
    description: 'Optimized for Core Web Vitals with image optimization, compression, and caching.',
  },
]
