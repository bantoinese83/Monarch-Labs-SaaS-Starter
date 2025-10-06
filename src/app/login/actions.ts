'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { loginFallback, signupFallback } from './actions-fallback'

export async function login(formData: FormData) {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.log('Supabase not configured, using fallback authentication')
    return loginFallback(formData)
  }

  try {
    const supabase = await createClient()

    // Type-casting here for convenience
    // In practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Supabase auth error:', error)
      redirect('/error?message=' + encodeURIComponent(error.message))
    }

    redirect('/dashboard')
  } catch (error) {
    console.error('Supabase client error:', error)
    // Fallback to demo auth if Supabase fails
    return loginFallback(formData)
  }
}

export async function signup(formData: FormData) {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.log('Supabase not configured, using fallback authentication')
    return signupFallback(formData)
  }

  try {
    const supabase = await createClient()

    // Type-casting here for convenience
    // In practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
      console.error('Supabase auth error:', error)
      redirect('/error?message=' + encodeURIComponent(error.message))
    }

    redirect('/dashboard')
  } catch (error) {
    console.error('Supabase client error:', error)
    // Fallback to demo auth if Supabase fails
    return signupFallback(formData)
  }
}