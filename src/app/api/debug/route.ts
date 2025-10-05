import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret key
  const debugKey = request.nextUrl.searchParams.get('key')
  if (process.env.NODE_ENV === 'production' && debugKey !== process.env.DEBUG_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check authentication status
  const authToken = request.cookies.get('auth-token')?.value
  const user = await getAuthenticatedUser(request)

  return Response.json({
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    timestamp: new Date().toISOString(),
    auth: {
      hasToken: !!authToken,
      tokenLength: authToken?.length || 0,
      user: user ? { id: user.id, email: user.email } : null,
    },
  })
}
