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

  // Try multiple cookie setting approaches
  const response = NextResponse.json({ user }, { status: 200 })
  
  // Approach 1: NextResponse.cookies.set()
  try {
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    console.log('Cookie set via NextResponse.cookies.set()')
  } catch (error) {
    console.error('NextResponse.cookies.set() failed:', error)
  }

  // Approach 2: Manual Set-Cookie header
  try {
    const cookieString = `auth-token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    response.headers.set('Set-Cookie', cookieString)
    console.log('Cookie set via manual Set-Cookie header:', cookieString)
  } catch (error) {
    console.error('Manual Set-Cookie header failed:', error)
  }

  // Approach 3: Multiple cookies for testing
  try {
    response.cookies.set('auth-token-test', token, {
      httpOnly: false, // Allow JavaScript access for testing
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    console.log('Test cookie set (non-HttpOnly)')
  } catch (error) {
    console.error('Test cookie setting failed:', error)
  }

  return response
}

export function createLogoutResponse() {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  
  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
