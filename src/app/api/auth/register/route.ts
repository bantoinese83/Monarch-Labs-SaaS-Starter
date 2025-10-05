export const runtime = 'nodejs'
import { NextRequest } from 'next/server'
import { registerSchema } from '@/lib/validation'
import { hashPassword } from '@/lib/hash'
import { createToken } from '@/lib/jwt'
import { createAuthResponse } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return Response.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Atomic user/team/member creation
    const [user, team] = await prisma.$transaction(async tx => {
      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'Owner',
        },
      })

      const createdTeam = await tx.team.create({
        data: {
          name: `${name || 'Owner'}'s Team`,
          ownerId: createdUser.id,
        },
      })

      await tx.user.update({
        where: { id: createdUser.id },
        data: { teamId: createdTeam.id },
      })

      await tx.teamMember.create({
        data: {
          teamId: createdTeam.id,
          userId: createdUser.id,
          role: 'Owner',
        },
      })

      return [createdUser, createdTeam]
    })

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      teamId: team.id,
      role: user.role,
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: team.id,
      eventType: 'USER_REGISTERED',
      details: { email, name },
    })

    return createAuthResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        teamId: team.id,
        role: user.role,
      },
      token,
    )
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
