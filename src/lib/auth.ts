import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './jwt'
import { prisma } from './db'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  teamId?: string
  role?: string
}

export async function getAuthenticatedUser(
  request: NextRequest,
): Promise<AuthenticatedUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Verify user still exists and get fresh data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        teamId: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      teamId: user.teamId || undefined,
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export function createAuthResponse(user: AuthenticatedUser, token: string) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  console.log('Creating auth response for user:', user.email)
  console.log('Production mode:', isProduction)
  console.log('Token length:', token.length)

  // Use manual Set-Cookie header approach (most reliable for production)
  const response = NextResponse.json({ 
    user, 
    token, // Include token in response for localStorage fallback
    message: 'Authentication successful. Token included for localStorage fallback.'
  }, { status: 200 })
  
  // Production-optimized cookie setting
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Secure in production, not in development
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
  
  console.log('Cookie options:', cookieOptions)
  
  // Method 1: Manual Set-Cookie header (most reliable)
  try {
    const secureFlag = isProduction ? '; Secure' : ''
    const cookieString = `auth-token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}${secureFlag}`
    response.headers.set('Set-Cookie', cookieString)
    console.log('Cookie set via manual Set-Cookie header:', cookieString)
  } catch (error) {
    console.error('Manual Set-Cookie header failed:', error)
  }

  // Method 2: NextResponse.cookies.set() as backup
  try {
    response.cookies.set('auth-token', token, cookieOptions)
    console.log('Cookie set via NextResponse.cookies.set()')
  } catch (error) {
    console.error('NextResponse.cookies.set() failed:', error)
  }

  // Method 3: Non-HttpOnly cookie for localStorage fallback
  try {
    response.cookies.set('auth-token-fallback', token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    console.log('Fallback cookie set (non-HttpOnly)')
  } catch (error) {
    console.error('Fallback cookie setting failed:', error)
  }

  return response
}

export function createLogoutResponse() {
  const isProduction = process.env.NODE_ENV === 'production'
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  
  // Clear the auth cookie with production-optimized settings
  const secureFlag = isProduction ? '; Secure' : ''
  const cookieString = `auth-token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureFlag}`
  response.headers.set('Set-Cookie', cookieString)
  
  // Also clear via NextResponse.cookies.set()
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
