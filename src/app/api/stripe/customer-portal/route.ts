import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageBilling } from '@/lib/rbac'
import { createCustomerPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageBilling(user, user.teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get team
    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
    })

    if (!team || !team.stripeCustomerId) {
      return Response.json({ error: 'No billing account found' }, { status: 404 })
    }

    // Create customer portal session
    const session = await createCustomerPortalSession({
      customerId: team.stripeCustomerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Create customer portal session error:', error)
    return Response.json({ error: 'Failed to create customer portal session' }, { status: 500 })
  }
}
