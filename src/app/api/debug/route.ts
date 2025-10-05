import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in development or with a secret key
  const debugKey = request.nextUrl.searchParams.get('key')
  if (process.env.NODE_ENV === 'production' && debugKey !== process.env.DEBUG_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    timestamp: new Date().toISOString(),
  })
}
