import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Geist, Geist_Mono, Special_Elite } from 'next/font/google'
import './globals.css'
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
  generateOrganizationStructuredData,
} from '@/lib/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const specialElite = Special_Elite({
  weight: '400',
  variable: '--font-grunge-display',
  subsets: ['latin'],
})

export const metadata: Metadata = generateSEOMetadata({
  title: 'Monarch Labs – Next.js SaaS Starter',
  description:
    'Monarch Labs offers a grunge‑themed, production‑ready Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
  keywords: [
    'Monarch Labs',
    'Next.js SaaS',
    'SaaS Starter',
    'Next.js Template',
    'React SaaS',
    'TypeScript SaaS',
    'Stripe Integration',
    'Prisma',
    'Supabase',
    'Authentication',
    'Team Management',
    'Billing',
    'SaaS Boilerplate',
    'Web Development',
    'Full Stack',
    'Production Ready',
  ],
  canonical: '/',
  openGraph: {
    title: 'Monarch Labs – Next.js SaaS Starter',
    description:
      'Grunge‑themed, production‑grade Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monarch Labs – Next.js SaaS Starter',
    description:
      'Grunge‑themed, production‑grade Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = generateStructuredData({
    title: 'Monarch Labs – Next.js SaaS Starter',
    description:
      'Monarch Labs offers a grunge‑themed, production‑ready Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
  })

  const organizationData = generateOrganizationStructuredData()

  return (
    <html lang="en" className="grunge-bg scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${specialElite.variable} antialiased touch-manipulation`}
      >
        <div className="min-h-screen grunge-bg grid grid-rows-[auto,1fr,auto]">
          <header className="w-full border-b grunge-border/50 bg-black/30 backdrop-blur-sm sticky top-0 z-50 safe-area-inset">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
              <Link
                href="/"
                aria-label="Monarch Labs"
                className="flex items-center gap-2 min-touch-target"
              >
                <Image
                  src="/monarch-logo.svg"
                  alt="Monarch Labs Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  priority
                />
                <span className="grunge-headline text-sm sm:text-base tracking-widest text-balance">
                  Monarch Labs
                </span>
              </Link>
              {/* Mobile menu button placeholder - can be expanded later */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  className="min-touch-target p-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="Menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>
          <main className="w-full">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {children}
            </div>
          </main>
          <footer className="w-full border-t grunge-border/50 bg-black/30 safe-area-inset">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
                <span className="text-balance">Built by Monarch Labs</span>
                <span className="text-zinc-500">© {new Date().getFullYear()}</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
