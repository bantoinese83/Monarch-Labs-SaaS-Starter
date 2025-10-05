import { NextResponse } from 'next/server'
import { generateNonce } from '@/lib/csp'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/pricing', '/login', '/signup', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/password/reset',
    '/api/stripe/webhook',
  ]
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  const token = request.cookies.get('auth-token')?.value

  // If user is authenticated and tries to visit login or signup, redirect to callbackUrl or dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    const callbackUrl = searchParams.get('callbackUrl')
    return NextResponse.redirect(new URL(callbackUrl || '/dashboard', request.url))
  }

  // If it's a public route or public API route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  if (!token) {
    // Redirect to login for protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/login', request.url)
      const current = new URL(request.url)
      loginUrl.searchParams.set('callbackUrl', current.pathname + current.search)
      return NextResponse.redirect(loginUrl)
    }
  }

  const res = NextResponse.next()

  // Security headers (production only)
  if (process.env.NODE_ENV === 'production') {
    const nonce = generateNonce()
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

    // CSP tightened: use nonce, and add Stripe & analytics domains
    const stripeJs = 'https://js.stripe.com'
    const stripeApi = 'https://api.stripe.com'
    const vercelInsights = 'https://vitals.vercel-insights.com'

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      `script-src 'self' 'nonce-${nonce}' ${stripeJs}`,
      "style-src 'self' 'unsafe-inline'",
      `connect-src 'self' ${stripeApi} ${vercelInsights}`,
      `frame-src ${stripeJs}`,
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ')
    res.headers.set('Content-Security-Policy', csp)
    res.headers.set('x-csp-nonce', nonce)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
