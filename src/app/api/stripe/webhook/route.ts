import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { logActivity } from '@/lib/activity-logger'

// Removed deprecated checkout session interface; we fetch expanded session

interface StripeSubscription {
  id: string
  customer: string
  status: string
  items?: {
    data?: Array<{
      price?: {
        id?: string
      }
    }>
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sessionObj = event.data.object as unknown as { id: string }
        // Retrieve expanded session to access line_items
        const session = await stripe.checkout.sessions.retrieve(sessionObj.id, {
          expand: ['line_items'],
        })
        const teamId = session?.metadata?.teamId as string | undefined
        const userId = session?.metadata?.userId as string | undefined

        if (teamId && userId) {
          // Update team subscription using line_items/price if expanded or subscription object retrieval
          let priceId: string | undefined
          try {
            if (session?.line_items?.data?.[0]?.price?.id) {
              priceId = session.line_items.data[0].price.id
            }
          } catch {}

          await prisma.team.update({
            where: { id: teamId },
            data: {
              stripeSubscriptionId: session.subscription as string | undefined,
              stripePriceId: priceId,
              subscriptionStatus: 'active',
            },
          })

          await logActivity({
            userId,
            teamId,
            eventType: 'PLAN_UPGRADED',
            details: {
              subscriptionId:
                typeof session.subscription === 'string' ? session.subscription : null,
              priceId,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as StripeSubscription
        const customerId = subscription.customer

        // Find team by customer ID
        const team = await prisma.team.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (team) {
          await prisma.team.update({
            where: { id: team.id },
            data: {
              subscriptionStatus: subscription.status,
              stripePriceId: subscription.items?.data?.[0]?.price?.id,
            },
          })

          // Log activity
          await logActivity({
            userId: team.ownerId,
            teamId: team.id,
            eventType: 'BILLING_UPDATED',
            details: {
              subscriptionId: subscription.id,
              status: subscription.status,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as StripeSubscription
        const customerId = subscription.customer

        // Find team by customer ID
        const team = await prisma.team.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (team) {
          await prisma.team.update({
            where: { id: team.id },
            data: {
              subscriptionStatus: 'canceled',
            },
          })

          // Log activity
          await logActivity({
            userId: team.ownerId,
            teamId: team.id,
            eventType: 'PLAN_CANCELLED',
            details: {
              subscriptionId: subscription.id,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Idempotency: record processed event id (avoid client model dependency)
    try {
      await prisma.$executeRaw`insert into "StripeEvent" (id) values (${event.id}) on conflict (id) do nothing`
    } catch {
      // If already handled (unique id), ignore
    }
    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
