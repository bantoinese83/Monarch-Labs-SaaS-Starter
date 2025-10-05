import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canAccessTeam } from '@/lib/rbac'
import { getActivityLogs } from '@/lib/activity-logger'
import { activityLogQuerySchema } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canAccessTeam(user, user.teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const getParam = (key: string) => {
      const value = searchParams.get(key)
      return value === null ? undefined : value
    }

    const query = activityLogQuerySchema.parse({
      limit: getParam('limit'),
      offset: getParam('offset'),
      eventType: getParam('eventType'),
    })

    const logs = await getActivityLogs(user.teamId, query)

    return Response.json({ logs })
  } catch (error) {
    console.error('Get activity logs error:', error)
    return Response.json({ error: 'Failed to fetch activity logs' }, { status: 500 })
  }
}
