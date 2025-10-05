import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageItem } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { createItemSchema, listItemsQuerySchema } from '@/lib/validation'
import { jsonError, jsonOk, parseJson } from '@/lib/http'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageItem(user, user.teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const { searchParams } = new URL(request.url)
    const parsed = listItemsQuerySchema.parse({
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      cursor: searchParams.get('cursor') ?? undefined,
    })

    const items = await prisma.item.findMany({
      where: {
        teamId: user.teamId,
        ...(parsed.status && { status: parsed.status }),
        ...(parsed.search && {
          OR: [
            { name: { contains: parsed.search, mode: 'insensitive' } },
            { description: { contains: parsed.search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: parsed.limit + 1,
      ...(parsed.cursor && { skip: 1, cursor: { id: parsed.cursor } }),
    })

    let nextCursor: string | undefined = undefined
    if (items.length > parsed.limit) {
      const next = items.pop()!
      nextCursor = next.id
    }

    return jsonOk({ items, nextCursor })
  } catch (error) {
    console.error('Get items error:', error)
    return jsonError('Failed to fetch items', 500)
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageItem(user, user.teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const { name, description, status } = await parseJson(request, createItemSchema)

    const item = await prisma.item.create({
      data: {
        teamId: user.teamId,
        name,
        description: description || '',
        status: status || 'active',
      },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: user.teamId,
      eventType: 'ITEM_CREATED',
      details: { itemId: item.id, name },
    })

    return jsonOk({ item })
  } catch (error) {
    console.error('Create item error:', error)
    return jsonError('Failed to create item', 500)
  }
}
