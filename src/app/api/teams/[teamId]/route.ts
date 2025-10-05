import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canAccessTeam, canManageTeam } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { updateTeamSchema } from '@/lib/validation'
import { jsonError, jsonOk, parseJson } from '@/lib/http'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const { teamId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !canAccessTeam(user, teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!team) {
      return jsonError('Team not found', 404)
    }

    return jsonOk({ team })
  } catch (error) {
    console.error('Get team error:', error)
    return jsonError('Failed to fetch team', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const { teamId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !canManageTeam(user, teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const { name } = await parseJson(request, updateTeamSchema)

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { name },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: teamId,
      eventType: 'TEAM_UPDATED',
      details: { name },
    })

    return jsonOk({ team })
  } catch (error) {
    console.error('Update team error:', error)
    return jsonError('Failed to update team', 500)
  }
}
