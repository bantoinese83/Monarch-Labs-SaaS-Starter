import { NextResponse } from 'next/server'
import { generateNonce } from '@/lib/csp'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/monarch-logo') ||
    pathname.startsWith('/next.svg') ||
    pathname.startsWith('/vercel.svg') ||
    pathname.startsWith('/window.svg') ||
    pathname.startsWith('/file.svg') ||
    pathname.startsWith('/globe.svg')
  ) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/pricing', '/login', '/signup', '/forgot-password', '/reset-password', '/privacy', '/terms']
  const isPublicRoute = publicRoutes.includes(pathname)

  // API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/password/reset',
    '/api/stripe/webhook',
    '/api/og',
    '/api/health',
    '/api/debug',
  ]
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  // Check for token in cookies first, then in localStorage (via custom header)
  const token = request.cookies.get('auth_tkk')?.value || 
                request.cookies.get('auth-token')?.value || 
                request.cookies.get('auth-token-fallback')?.value ||
                request.headers.get('x-auth-token')
  const isAuthenticated = !!token
  
  // Debug: Log cookie information
  if (process.env.NODE_ENV === 'production') {
    console.log('Middleware - Path:', pathname)
    console.log('Middleware - Has token:', !!token)
    console.log('Middleware - Token length:', token?.length || 0)
    console.log('Middleware - All cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    console.log('Middleware - Cookie names:', request.cookies.getAll().map(c => c.name))
    console.log('Middleware - Request headers:', Object.fromEntries(request.headers.entries()))
  }

  // If it's a public route or public API route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // If user is authenticated and tries to visit login or signup, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    const callbackUrl = searchParams.get('callbackUrl')
    return NextResponse.redirect(new URL(callbackUrl || '/dashboard', request.url))
  }

  // If user is not authenticated and tries to access protected routes
  if (!isAuthenticated) {
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
    // Allow Vercel Live/Feedback script in nonces list (tooling only)
    const vercelLive = 'https://vercel.live'
    const stripeApi = 'https://api.stripe.com'
    const vercelInsights = 'https://vitals.vercel-insights.com'

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      // Allow inline scripts via nonce, and tooling domains. If errors persist in
      // 3rd-party injected inline, temporarily include 'unsafe-inline'.
      `script-src 'self' 'nonce-${nonce}' ${stripeJs} ${vercelLive}`,
      "style-src 'self'",
      `connect-src 'self' ${stripeApi} ${vercelInsights} ${vercelLive}`,
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
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|monarch-logo.svg|next.svg|vercel.svg|window.svg|file.svg|globe.svg).*)',
  ],
}
