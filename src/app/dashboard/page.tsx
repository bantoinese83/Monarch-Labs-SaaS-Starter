'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, CreditCard, FileText, Activity, TrendingUp } from 'lucide-react'
// Prisma JSON type differs across versions; use unknown for API payload

interface DashboardStats {
  totalItems: number
  teamMembers: number
  subscriptionStatus: string
  recentActivity: Array<{
    id: string
    eventType: string
    details: unknown
    timestamp: string
    user: {
      name: string
      email: string
    }
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsResponse, teamResponse, activityResponse] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/teams/current'),
          fetch('/api/activity-logs?limit=5'),
        ])

        const items = await itemsResponse.json()
        const team = await teamResponse.json()
        const activity = await activityResponse.json()

        setStats({
          totalItems: items.items?.length || 0,
          teamMembers: team.team?.members?.length || 0,
          subscriptionStatus: team.team?.subscriptionStatus || 'trialing',
          recentActivity: activity.logs || [],
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-black/30 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="grunge-paper p-6 rounded-lg">
                <div className="h-4 bg-black/30 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-black/30 rounded w-1/3"></div>
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
        <h1 className="text-3xl grunge-headline">Dashboard</h1>
        <p className="text-gray-300 grunge-ink">
          Welcome back! Here&apos;s what&apos;s happening with your team.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="grunge-paper p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-fuchsia-900/30 rounded-lg grunge-border">
              <FileText className="h-6 w-6 text-fuchsia-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Items</p>
              <p className="text-2xl grunge-headline">{stats?.totalItems || 0}</p>
            </div>
          </div>
        </div>

        <div className="grunge-paper p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-fuchsia-900/30 rounded-lg grunge-border">
              <Users className="h-6 w-6 text-fuchsia-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Team Members</p>
              <p className="text-2xl grunge-headline">{stats?.teamMembers || 0}</p>
            </div>
          </div>
        </div>

        <div className="grunge-paper p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-fuchsia-900/30 rounded-lg grunge-border">
              <CreditCard className="h-6 w-6 text-fuchsia-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Subscription</p>
              <p className="text-2xl grunge-headline capitalize">
                {stats?.subscriptionStatus || 'Trialing'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="grunge-paper p-6 rounded-lg">
          <h3 className="text-lg grunge-headline mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/items/new"
              className="flex items-center p-3 rounded-lg grunge-border hover:bg-black/30"
            >
              <FileText className="h-5 w-5 text-gray-300 mr-3" />
              <span className="text-gray-200">Create New Item</span>
            </Link>
            <Link
              href="/dashboard/settings/team"
              className="flex items-center p-3 rounded-lg grunge-border hover:bg.black/30"
            >
              <Users className="h-5 w-5 text-gray-300 mr-3" />
              <span className="text-gray-200">Manage Team</span>
            </Link>
            <Link
              href="/dashboard/settings/billing"
              className="flex items-center p-3 rounded-lg grunge-border hover:bg-black/30"
            >
              <CreditCard className="h-5 w-5 text-gray-300 mr-3" />
              <span className="text-gray-200">Update Billing</span>
            </Link>
          </div>
        </div>

        <div className="grunge-paper p-6 rounded-lg">
          <h3 className="text-lg grunge-headline mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start">
                  <div className="p-1 bg-black/50 rounded-full mr-3 grunge-border">
                    <Activity className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200">
                      <span className="grunge-headline">{activity.user.name}</span>{' '}
                      {getActivityDescription(activity.eventType)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {stats?.subscriptionStatus === 'trialing' && (
        <div className="grunge-border rounded-lg p-4 bg-fuchsia-900/10">
          <div className="flex">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm grunge-headline">You&apos;re on a free trial</h3>
              <div className="mt-2 text-sm text-gray-300">
                <p>Upgrade to a paid plan to unlock all features and remove usage limits.</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/dashboard/settings/billing"
                  className="grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:from-fuchsia-500 hover:to-purple-600"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getActivityDescription(eventType: string): string {
  const descriptions: Record<string, string> = {
    USER_REGISTERED: 'joined the team',
    USER_LOGIN: 'signed in',
    TEAM_CREATED: 'created the team',
    TEAM_UPDATED: 'updated team settings',
    MEMBER_ADDED: 'added a team member',
    MEMBER_REMOVED: 'removed a team member',
    ITEM_CREATED: 'created a new item',
    ITEM_UPDATED: 'updated an item',
    ITEM_DELETED: 'deleted an item',
    PLAN_UPGRADED: 'upgraded the plan',
    BILLING_UPDATED: 'updated billing settings',
  }
  return descriptions[eventType] || 'performed an action'
}
