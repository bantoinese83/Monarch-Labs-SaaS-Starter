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
    const parsed = resetSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: true })
    }

    const { email, redirectTo } = parsed.data

    if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
      return Response.json({ success: true })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) {
      console.warn('Password reset provider error:', error.message)
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error('Password reset error:', error)
    return Response.json({ success: true })
  }
}
