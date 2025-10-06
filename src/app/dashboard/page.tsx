import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, CreditCard, FileText, Activity } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  let user = null
  let userEmail = 'demo@example.com'

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    // Use fallback authentication (demo cookies)
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('demo-auth')?.value === 'true'
    const userCookie = cookieStore.get('demo-user')?.value
    
    if (!isAuthenticated) {
      redirect('/login')
    }

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie)
        userEmail = userData.email || 'demo@example.com'
      } catch (error) {
        console.error('Error parsing user cookie:', error)
      }
    }
  } else {
    // Use Supabase authentication
    try {
      const supabase = await createClient()
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser()

      if (!supabaseUser) {
        redirect('/login')
      }

      user = supabaseUser
      userEmail = user.email || 'user@example.com'
    } catch (error) {
      console.error('Supabase auth error:', error)
      redirect('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">Welcome back, {userEmail}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-fuchsia-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Total Items
                  </dt>
                  <dd className="text-lg font-medium text-white">0</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Team Members
                  </dt>
                  <dd className="text-lg font-medium text-white">1</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    Subscription
                  </dt>
                  <dd className="text-lg font-medium text-white">Free</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-300 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-white">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/items/new"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
              >
                Create New Item
              </Link>
              <Link
                href="/dashboard/settings/billing"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Manage Billing
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
            <div className="text-center text-gray-400 py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p>No recent activity</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-fuchsia-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-2">Create Your First Item</h4>
              <p className="text-gray-300 text-sm">
                Start by creating your first item to get familiar with the platform.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-fuchsia-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-2">Invite Team Members</h4>
              <p className="text-gray-300 text-sm">
                Collaborate with your team by inviting members to your workspace.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-fuchsia-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-2">Upgrade Your Plan</h4>
              <p className="text-gray-300 text-sm">
                Unlock advanced features with our Pro plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}