import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Geist, Geist_Mono, Special_Elite } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Monarch Labs – Next.js SaaS Starter',
    template: '%s • Monarch Labs',
  },
  description:
    'Monarch Labs offers a grunge‑themed, production‑ready Next.js SaaS starter with auth, billing, and great DX.',
  keywords: ['Monarch Labs', 'Next.js SaaS', 'Stripe', 'Prisma', 'Supabase', 'TypeScript'],
  authors: [{ name: 'Monarch Labs' }],
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon.ico' },
  ],
  openGraph: {
    title: 'Monarch Labs – Next.js SaaS Starter',
    description: 'Grunge‑themed, production‑grade Next.js SaaS starter (auth, billing, DX).',
    siteName: 'Monarch Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monarch Labs – Next.js SaaS Starter',
    description: 'Grunge‑themed, production‑grade Next.js SaaS starter (auth, billing, DX).',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="grunge-bg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${specialElite.variable} antialiased`}
      >
        <div className="min-h-screen grunge-bg grid grid-rows-[auto,1fr,auto]">
          <header className="w-full border-b grunge-border/50 bg-black/30 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
              <Link href="/" aria-label="Monarch Labs" className="flex items-center gap-2">
                <Image src="/monarch-logo.svg" alt="" width={28} height={28} />
                <span className="grunge-headline text-sm tracking-widest">Monarch Labs</span>
              </Link>
            </div>
          </header>
          <main className="w-full">
            <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
          </main>
          <footer className="w-full border-t grunge-border/50 bg-black/30">
            <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-400 flex items-center justify-between">
              <span>Built by Monarch Labs</span>
              <span className="text-zinc-500">© {new Date().getFullYear()}</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
