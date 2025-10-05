export const runtime = 'nodejs'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient } from '@/lib/supabase'
import { ENV } from '@/env'

const resetSchema = z.object({
  email: z.string().email('Invalid email'),
  redirectTo: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, redirectTo } = resetSchema.parse(body)

    if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
      return Response.json(
        { error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.' },
        { status: 500 },
      )
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || 'Invalid request' },
        { status: 422 },
      )
    }
    console.error('Password reset error:', error)
    return Response.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
