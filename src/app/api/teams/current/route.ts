import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
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
      return Response.json({ error: 'Team not found' }, { status: 404 })
    }

    return Response.json({ team })
  } catch (error) {
    console.error('Get team error:', error)
    return Response.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}
