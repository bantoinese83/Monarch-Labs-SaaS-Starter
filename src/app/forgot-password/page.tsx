'use client'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const parsed = forgotSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Please enter a valid email')
      return
    }

    try {
      setIsSubmitting(true)
      const publicUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const redirectTo = `${publicUrl}/reset-password`
      const res = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "We couldn't process your request. Try again later.")
      }
      setMessage('If an account exists, a reset link has been sent.')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      setEmail('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't process your request. Try again later.",
      )
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
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the email associated with your account and we will send you a link to reset your
        password.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        >
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
        {message && !showToast ? <p className="text-sm text-green-600">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
      <div className="mt-6 text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
