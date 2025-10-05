import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value
  
  console.log('Middleware Debug:', {
    pathname,
    hasToken: !!token,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
  })

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
  ]
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  const isAuthenticated = !!token

  // If it's a public route or public API route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    console.log('Allowing public route:', pathname)
    return NextResponse.next()
  }

  // If user is authenticated and tries to visit login or signup, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    const callbackUrl = searchParams.get('callbackUrl')
    console.log('Redirecting authenticated user from auth page to:', callbackUrl || '/dashboard')
    return NextResponse.redirect(new URL(callbackUrl || '/dashboard', request.url))
  }

  // If user is not authenticated and tries to access protected routes
  if (!isAuthenticated) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      if (pathname.startsWith('/api/')) {
        console.log('Unauthorized API access:', pathname)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      console.log('Redirecting unauthenticated user to login from:', pathname)
      const loginUrl = new URL('/login', request.url)
      const current = new URL(request.url)
      loginUrl.searchParams.set('callbackUrl', current.pathname + current.search)
      return NextResponse.redirect(loginUrl)
    }
  }

  console.log('Allowing access to:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|monarch-logo.svg|next.svg|vercel.svg|window.svg|file.svg|globe.svg).*)',
  ],
}
