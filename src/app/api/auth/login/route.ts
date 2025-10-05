export const runtime = 'nodejs'
import { NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validation'
import { verifyPassword } from '@/lib/hash'
import { createToken } from '@/lib/jwt'
import { createAuthResponse } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create JWT token
    let token: string
    try {
      token = await createToken({
        userId: user.id,
        email: user.email,
        teamId: user.teamId || undefined,
        role: user.role,
      })
    } catch (error) {
      console.error('JWT token creation failed:', error)
      return Response.json({ error: 'Authentication service unavailable' }, { status: 500 })
    }

    // Log activity
    if (user.teamId) {
      await logActivity({
        userId: user.id,
        teamId: user.teamId,
        eventType: 'USER_LOGIN',
        details: { email },
      })
    }

    const response = createAuthResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        teamId: user.teamId || undefined,
        role: user.role,
      },
      token,
    )
    
    // Add CORS headers for credentials
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'https://monarch-labs-saas-starter.vercel.app')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Failed to login' }, { status: 500 })
  }
}
