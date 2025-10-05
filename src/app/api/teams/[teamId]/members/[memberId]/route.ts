import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageMembers } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { updateMemberRoleSchema } from '@/lib/validation'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> },
) {
  const { teamId, memberId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !canManageMembers(user, teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { role } = updateMemberRoleSchema.parse(body)

    const member = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: memberId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: teamId,
      eventType: 'MEMBER_ROLE_UPDATED',
      details: {
        memberId: memberId,
        newRole: role,
      },
    })

    return Response.json({ member })
  } catch (error) {
    console.error('Update member role error:', error)
    return Response.json({ error: 'Failed to update member role' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> },
) {
  const { teamId, memberId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !canManageMembers(user, teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get member info before deletion for logging
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: memberId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!member) {
      return Response.json({ error: 'Member not found' }, { status: 404 })
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: memberId,
        },
      },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: teamId,
      eventType: 'MEMBER_REMOVED',
      details: {
        memberId: memberId,
        memberEmail: member.user.email,
      },
    })

    return Response.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member error:', error)
    return Response.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
