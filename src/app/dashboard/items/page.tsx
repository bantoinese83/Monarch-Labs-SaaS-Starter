'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface Item {
  id: string
  name: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/items?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, statusFilter])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId))
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-900/30 text-green-300',
      draft: 'bg-yellow-900/30 text-yellow-300',
      archived: 'bg-gray-900/30 text-gray-300',
    }
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}
      >
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-black/30 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="grunge-paper p-4 rounded-lg">
                <div className="h-4 bg-black/30 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-black/30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl grunge-headline">Items</h1>
            <p className="text-gray-300 grunge-ink">Manage your team&apos;s items and content</p>
          </div>
          <Link
            href="/dashboard/items/new"
            className="inline-flex items-center px-4 py-2 rounded-lg grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Item
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grunge-paper p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 grunge-border rounded-lg bg-black/40 text-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 grunge-border rounded-lg bg-black/40 text-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="grunge-paper rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12" />}
            title="No items"
            description="Get started by creating a new item."
            actionHref="/dashboard/items/new"
            actionLabel="New Item"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs grunge-headline uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs grunge-headline uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs grunge-headline uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs grunge-headline uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs grunge-headline uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-black/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm grunge-headline">{item.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-xs truncate">
                        {item.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/items/${item.id}`}
                          className="text-fuchsia-400 hover:text-fuchsia-300"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/items/${item.id}/edit`}
                          className="text-purple-400 hover:text-purple-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
