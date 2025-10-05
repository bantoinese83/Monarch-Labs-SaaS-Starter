import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageItem } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { updateItemSchema } from '@/lib/validation'
import { jsonError, jsonOk, parseJson } from '@/lib/http'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageItem(user, user.teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        teamId: user.teamId,
      },
    })

    if (!item) {
      return jsonError('Item not found', 404)
    }

    return jsonOk({ item })
  } catch (error) {
    console.error('Get item error:', error)
    return jsonError('Failed to fetch item', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageItem(user, user.teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    const { name, description, status } = await parseJson(request, updateItemSchema)

    const item = await prisma.item.updateMany({
      where: {
        id: itemId,
        teamId: user.teamId,
      },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    })

    if (item.count === 0) {
      return jsonError('Item not found', 404)
    }

    const updatedItem = await prisma.item.findUnique({
      where: { id: itemId },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: user.teamId,
      eventType: 'ITEM_UPDATED',
      details: {
        itemId,
        updatedFields: {
          ...(name !== undefined ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(status !== undefined ? { status } : {}),
        },
      },
    })

    return jsonOk({ item: updatedItem })
  } catch (error) {
    console.error('Update item error:', error)
    return jsonError('Failed to update item', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageItem(user, user.teamId)) {
    return jsonError('Unauthorized', 401)
  }

  try {
    // Get item info before deletion for logging
    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        teamId: user.teamId,
      },
    })

    if (!item) {
      return jsonError('Item not found', 404)
    }

    await prisma.item.delete({
      where: { id: itemId },
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: user.teamId,
      eventType: 'ITEM_DELETED',
      details: { itemId: itemId, name: item.name },
    })

    return jsonOk({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Delete item error:', error)
    return jsonError('Failed to delete item', 500)
  }
}
