import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { jsonError, jsonOk, parseJson } from '@/lib/http'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return jsonError('Unauthorized', 401)
  }

  return jsonOk({ user })
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const { updateUserSchema } = await import('@/lib/validation')
    const { name, email } = await parseJson(request, updateUserSchema)

    const { prisma } = await import('@/lib/db')
    const { logActivity } = await import('@/lib/activity-logger')

    // If email is changing, ensure uniqueness
    if (email) {
      const exists = await prisma.user.findUnique({ where: { email } })
      if (exists && exists.id !== user.id) {
        return Response.json({ error: 'Email already in use' }, { status: 400 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        teamId: true,
        role: true,
      },
    })

    // Log activity
    if (user.teamId) {
      await logActivity({
        userId: user.id,
        teamId: user.teamId,
        eventType: 'USER_UPDATED',
        details: { updatedFields: { name, email } },
      })
    }

    return jsonOk({ user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return jsonError('Failed to update profile', 500)
  }
}
