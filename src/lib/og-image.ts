import { generateMetadata } from './seo'

export interface OGImageConfig {
  title: string
  description: string
  type?: 'website' | 'article' | 'product'
  theme?: 'dark' | 'light'
  path?: string
}

export function generateOGImageUrl(config: OGImageConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const params = new URLSearchParams({
    title: config.title,
    description: config.description,
    type: config.type || 'website',
    theme: config.theme || 'dark',
  })

  return `${baseUrl}/api/og?${params.toString()}`
}

export function generatePageMetadata(config: OGImageConfig) {
  const ogImageUrl = generateOGImageUrl(config)

  return generateMetadata({
    title: config.title,
    description: config.description,
    canonical: config.path || '/',
    openGraph: {
      title: config.title,
      description: config.description,
      image: ogImageUrl,
      type: config.type === 'article' ? 'article' : 'website',
      url: config.path || '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      image: ogImageUrl,
    },
  })
}

// Predefined OG image configurations for common pages
export const pageOGConfigs = {
  home: {
    title: 'Monarch Labs – Next.js SaaS Starter',
    description:
      'Grunge‑themed, production‑grade Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/',
  },
  pricing: {
    title: 'Pricing – Monarch Labs',
    description:
      'Choose the perfect plan for your SaaS project. Transparent pricing with no hidden fees.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/pricing',
  },
  login: {
    title: 'Login – Monarch Labs',
    description: 'Sign in to your Monarch Labs account and continue building your SaaS.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/login',
  },
  signup: {
    title: 'Sign Up – Monarch Labs',
    description:
      'Join Monarch Labs and start building your SaaS with our complete starter template.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/signup',
  },
  dashboard: {
    title: 'Dashboard – Monarch Labs',
    description: 'Manage your SaaS project with our comprehensive dashboard.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/dashboard',
  },
  privacy: {
    title: 'Privacy Policy – Monarch Labs',
    description: 'Learn how Monarch Labs protects your privacy and handles your data.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Service – Monarch Labs',
    description: 'Read our terms of service and understand your rights and responsibilities.',
    type: 'website' as const,
    theme: 'dark' as const,
    path: '/terms',
  },
} as const

export type PageOGConfigKey = keyof typeof pageOGConfigs
