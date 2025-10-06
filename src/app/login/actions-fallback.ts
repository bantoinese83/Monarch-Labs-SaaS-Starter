'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Fallback authentication for when Supabase is not configured
export async function loginFallback(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Simple validation
  if (!email || !password) {
    redirect('/error?message=Email and password are required')
  }

  // For demo purposes, accept any email/password combination
  // In production, you would validate against your database
  if (email && password) {
    // Set a simple session cookie
    const cookieStore = await cookies()
    cookieStore.set('demo-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    // Store user info in a simple cookie
    cookieStore.set('demo-user', JSON.stringify({ email, name: email.split('@')[0] }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect('/dashboard')
  }

  redirect('/error?message=Invalid credentials')
}

export async function signupFallback(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Simple validation
  if (!email || !password || !name) {
    redirect('/error?message=All fields are required')
  }

  // For demo purposes, accept any signup
  // In production, you would create a user in your database
  if (email && password && name) {
    // Set a simple session cookie
    const cookieStore = await cookies()
    cookieStore.set('demo-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    // Store user info in a simple cookie
    cookieStore.set('demo-user', JSON.stringify({ email, name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    redirect('/dashboard')
  }

  redirect('/error?message=Signup failed')
}
