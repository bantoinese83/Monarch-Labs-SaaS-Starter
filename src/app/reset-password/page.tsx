'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: true,
      },
    })

    // Consumes the recovery link by parsing hash params and setting a session
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsSessionReady(true)
      }
    })

    // Trigger initial check (handles already-parsed session in some cases)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setIsSessionReady(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const parsed = schema.safeParse({ password, confirmPassword })
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      setError(issue?.message || 'Invalid input')
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: true,
      },
    })

    try {
      setIsSubmitting(true)
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      if (updateError) {
        throw new Error(updateError.message)
      }
      setMessage('Password updated. Redirecting to sign in…')
      setShowToast(true)
      setPassword('')
      setConfirmPassword('')
      // Redirect to login after a short delay for UX
      setTimeout(() => router.push('/login'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      {showToast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white shadow"
        >
          {message || 'Success'}
        </div>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the form below to set a new password for your account.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isSessionReady}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        >
          {isSubmitting ? 'Updating…' : 'Update password'}
        </button>
        {!isSessionReady ? (
          <p className="text-xs text-muted-foreground">
            Waiting for recovery session… open this page from the email link.
          </p>
        ) : null}
        {message && !showToast ? <p className="text-sm text-green-600">{message}</p> : null}
        {error ? (
          <p className="text-sm text-red-600">
            {error || "We couldn't process your request. Try again later."}
          </p>
        ) : null}
      </form>

      <div className="mt-6 text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
