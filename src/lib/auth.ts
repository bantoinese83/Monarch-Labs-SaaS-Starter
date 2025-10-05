import { NextRequest } from 'next/server'
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
  
  // Create cookie string with proper formatting
  const cookieString = [
    `auth-token=${token}`,
    'HttpOnly',
    isProduction ? 'Secure' : undefined,
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${60 * 60 * 24 * 7}`,
  ].filter(Boolean).join('; ')

  console.log('Setting auth cookie:', cookieString)

  const response = new Response(JSON.stringify({ user }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieString,
    },
  })

  return response
}

export function createLogoutResponse() {
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieParts = [
    'auth-token=',
    'HttpOnly',
    isProduction ? 'Secure' : undefined,
    'SameSite=Lax', // Changed from Strict to Lax for better compatibility
    'Path=/',
    'Max-Age=0',
    // Don't set domain in production to avoid cookie issues
  ].filter(Boolean)

  const response = new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieParts.join('; '),
    },
  })

  return response
}
