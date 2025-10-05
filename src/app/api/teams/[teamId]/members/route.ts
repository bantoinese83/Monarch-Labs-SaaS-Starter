import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageMembers } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { addMemberSchema } from '@/lib/validation'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const { teamId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !canManageMembers(user, teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, role } = addMemberSchema.parse(body)

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: targetUser.id,
        },
      },
    })

    if (existingMember) {
      return Response.json({ error: 'User is already a member of this team' }, { status: 400 })
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId: teamId,
        userId: targetUser.id,
        role,
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

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: teamId,
      eventType: 'MEMBER_ADDED',
      details: {
        memberId: targetUser.id,
        memberEmail: email,
        role,
      },
    })

    return Response.json({ member })
  } catch (error) {
    console.error('Add member error:', error)
    return Response.json({ error: 'Failed to add member' }, { status: 500 })
  }
}
