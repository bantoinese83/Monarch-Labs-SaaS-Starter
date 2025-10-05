import type { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    siteName?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    title?: string
    description?: string
    image?: string
    creator?: string
    site?: string
  }
  structuredData?: Record<string, unknown>
  robots?: {
    index?: boolean
    follow?: boolean
    noarchive?: boolean
    nosnippet?: boolean
    noimageindex?: boolean
    nocache?: boolean
  }
}

const defaultConfig = {
  siteName: 'Monarch Labs',
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  defaultImage:
    '/api/og?title=Monarch%20Labs&description=Next.js%20SaaS%20Starter&type=website&theme=dark',
  twitterHandle: '@monarchlabs',
  author: 'Monarch Labs',
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    openGraph,
    twitter,
    robots = { index: true, follow: true },
  } = config

  const fullTitle = title.includes('Monarch Labs') ? title : `${title} • Monarch Labs`
  const canonicalUrl = canonical ? `${defaultConfig.siteUrl}${canonical}` : undefined

  return {
    metadataBase: new URL(defaultConfig.siteUrl),
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: defaultConfig.author }],
    creator: defaultConfig.author,
    publisher: defaultConfig.author,
    robots: {
      index: robots.index,
      follow: robots.follow,
      noarchive: robots.noarchive,
      nosnippet: robots.nosnippet,
      noimageindex: robots.noimageindex,
      nocache: robots.nocache,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      url: openGraph?.url || canonicalUrl,
      siteName: openGraph?.siteName || defaultConfig.siteName,
      type: openGraph?.type || 'website',
      images: openGraph?.image
        ? [
            {
              url: openGraph.image,
              width: 1200,
              height: 630,
              alt: openGraph.title || fullTitle,
            },
          ]
        : [
            {
              url: defaultConfig.defaultImage,
              width: 1200,
              height: 630,
              alt: fullTitle,
            },
          ],
    },
    twitter: {
      card: twitter?.card || 'summary_large_image',
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      images: twitter?.image ? [twitter.image] : [defaultConfig.defaultImage],
      creator: twitter?.creator || defaultConfig.twitterHandle,
      site: twitter?.site || defaultConfig.twitterHandle,
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'format-detection': 'telephone=no',
    },
  }
}

export function generateStructuredData(config: SEOConfig) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultConfig.siteName,
    url: defaultConfig.siteUrl,
    description: config.description,
    author: {
      '@type': 'Organization',
      name: defaultConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: defaultConfig.author,
    },
  }

  if (config.structuredData) {
    return {
      ...baseStructuredData,
      ...config.structuredData,
    }
  }

  return baseStructuredData
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${defaultConfig.siteUrl}${item.url}`,
    })),
  }
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: defaultConfig.siteName,
    url: defaultConfig.siteUrl,
    logo: `${defaultConfig.siteUrl}/monarch-logo.svg`,
    description:
      'Monarch Labs offers a grunge‑themed, production‑ready Next.js SaaS starter with auth, billing, and great DX.',
    sameAs: [
      // Add social media URLs here when available
    ],
  }
}

export function generateSoftwareApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Monarch Labs SaaS Starter',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description:
      'A complete Next.js starter template with authentication, payments, team management, and everything you need to launch your SaaS product.',
    url: defaultConfig.siteUrl,
    author: {
      '@type': 'Organization',
      name: defaultConfig.author,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}
