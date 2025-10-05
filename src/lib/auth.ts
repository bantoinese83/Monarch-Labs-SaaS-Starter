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

  // Use NextResponse for better cookie handling
  const response = NextResponse.json({ user }, { status: 200 })
  
  // Set cookie using NextResponse.cookies
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: false, // Temporarily disable for testing
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  console.log('Cookie set via NextResponse.cookies')

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
