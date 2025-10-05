import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monarch Labs – Next.js SaaS Starter',
    short_name: 'Monarch Labs',
    description:
      'Grunge‑themed, production‑grade Next.js SaaS starter with authentication, payments, team management, and everything you need to launch your SaaS product.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0b',
    theme_color: '#7c3aed',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['developer', 'productivity', 'business'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/monarch-logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/monarch-logo.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
