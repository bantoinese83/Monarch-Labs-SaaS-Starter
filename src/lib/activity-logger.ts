import { prisma } from './db'
// Avoid Prisma version-specific JSON types in shared code

export type EventType =
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_UPDATED'
  | 'TEAM_CREATED'
  | 'TEAM_UPDATED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED'
  | 'MEMBER_ROLE_UPDATED'
  | 'PLAN_UPGRADED'
  | 'PLAN_DOWNGRADED'
  | 'PLAN_CANCELLED'
  | 'ITEM_CREATED'
  | 'ITEM_UPDATED'
  | 'ITEM_DELETED'
  | 'BILLING_UPDATED'

export interface ActivityLogData {
  userId: string
  teamId: string
  eventType: EventType
  details: unknown
}

export async function logActivity(data: ActivityLogData) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        teamId: data.teamId,
        eventType: data.eventType,
        details: data.details as any,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
    // Don't throw - activity logging should not break the main flow
  }
}

export async function getActivityLogs(
  teamId: string,
  options: {
    limit?: number
    offset?: number
    eventType?: string
  } = {},
) {
  const { limit = 20, offset = 0, eventType } = options

  return prisma.activityLog.findMany({
    where: {
      teamId,
      ...(eventType && { eventType }),
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
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
    skip: offset,
  })
}
