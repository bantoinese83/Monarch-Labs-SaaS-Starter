import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { canManageBilling } from '@/lib/rbac'
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'
import { createCheckoutSessionSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user || !user.teamId || !canManageBilling(user, user.teamId)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { priceId } = createCheckoutSessionSchema.parse(body)

    // Validate price ID
    if (!Object.values(STRIPE_PRICES).includes(priceId)) {
      return Response.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    // Get team
    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
    })

    if (!team) {
      return Response.json({ error: 'Team not found' }, { status: 404 })
    }

    // Create or get Stripe customer
    let customerId = team.stripeCustomerId

    if (!customerId) {
      const { stripe } = await import('@/lib/stripe')
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          teamId: team.id,
          userId: user.id,
        },
      })

      customerId = customer.id

      // Update team with customer ID
      await prisma.team.update({
        where: { id: team.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      teamId: team.id,
      userId: user.id,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?canceled=true`,
    })

    // Log activity
    await logActivity({
      userId: user.id,
      teamId: team.id,
      eventType: 'PLAN_UPGRADED',
      details: { priceId, sessionId: session.id },
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Create checkout session error:', error)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
