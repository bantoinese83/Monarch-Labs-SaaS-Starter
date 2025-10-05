'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // Debug: Check if cookie was set
      console.log('Registration successful, checking cookies...')
      console.log('Document cookies:', document.cookie)
      
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      window.location.href = callbackUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen grunge-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-700" />
            <span className="text-2xl grunge-headline">SaaS Starter</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl grunge-headline">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link href="/login" className="text-fuchsia-300 hover:text-fuchsia-200">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="grunge-border bg-red-900/20 p-4 text-red-300 rounded-md">
              <div className="text-sm">{error}</div>
            </div>
          )}
          <Card>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 grunge-border rounded-lg bg-black/40 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 grunge-border rounded-lg bg-black/40 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-10 py-2 grunge-border rounded-lg bg-black/40 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-fuchsia-300 hover:text-fuchsia-200">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-fuchsia-300 hover:text-fuchsia-200">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  )
}
