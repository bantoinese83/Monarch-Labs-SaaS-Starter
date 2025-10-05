'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NewItemPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create item')
      }

      router.push('/dashboard/items')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard/items"
            className="mr-4 text-gray-400 hover:text-white"
            aria-label="Back to items"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl grunge-headline">Create New Item</h1>
            <p className="text-gray-300 grunge-ink">
              Add a new item to your team&apos;s collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="grunge-border bg-red-900/20 p-4 text-red-300 rounded-md">
              <div className="text-sm">{error}</div>
            </div>
          )}

          <Card>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-300">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Enter item description"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm text-gray-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end space-x-4">
            <Link href="/dashboard/items" className="text-gray-300 hover:text-white">
              Cancel
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Creating...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Item
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
