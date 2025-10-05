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

    return createAuthResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        teamId: user.teamId || undefined,
        role: user.role,
      },
      token,
    )
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Failed to login' }, { status: 500 })
  }
}
