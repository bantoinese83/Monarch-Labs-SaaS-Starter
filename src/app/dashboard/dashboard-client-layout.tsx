'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, CreditCard, FileText, LogOut, Menu, X, User } from 'lucide-react'
import { AuthenticatedUser } from '@/lib/auth'

export default function DashboardClientLayout({
  user,
  children,
}: {
  user: AuthenticatedUser
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Items', href: '/dashboard/items', icon: FileText },
    { name: 'Team', href: '/dashboard/settings/team', icon: Users },
    { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen grunge-bg lg:flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-64 flex-col grunge-paper">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-700" />
              <span className="text-xl grunge-headline">SaaS Starter</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close menu"
              aria-controls="mobile-sidebar"
              aria-expanded="true"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4" id="mobile-sidebar">
            {navigation.map(item => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium grunge-border ${
                    isActive
                      ? 'bg-fuchsia-900/20 text-white'
                      : 'text-gray-300 hover:bg-black/30 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-64 lg:flex-col lg:h-screen lg:overflow-y-auto">
        <div className="flex flex-col flex-grow grunge-paper">
          <div className="flex h-16 items-center px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-700" />
              <span className="text-xl grunge-headline">SaaS Starter</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map(item => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium grunge-border ${
                    isActive
                      ? 'bg-fuchsia-900/20 text-white'
                      : 'text-gray-300 hover:bg-black/30 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="grunge-border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center grunge-border">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm grunge-headline">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 text-gray-400 hover:text-white"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:flex-1 min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 bg-black/30 grunge-border lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 hover:text-white"
              aria-label="Open menu"
              aria-controls="mobile-sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-700" />
              <span className="text-xl grunge-headline">SaaS Starter</span>
            </Link>
            <div className="h-8 w-8" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 min-w-0">
          <div className="px-6 py-6 lg:px-8 xl:px-10 max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
