import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/env'

export function getSupabaseClient() {
  const supabaseUrl = ENV.SUPABASE_URL
  const supabaseAnonKey = ENV.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured: set SUPABASE_URL and SUPABASE_ANON_KEY')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
