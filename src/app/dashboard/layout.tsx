import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/db'
import DashboardClientLayout from './dashboard-client-layout'
import { AuthenticatedUser } from '@/lib/auth'

async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        teamId: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      ...user,
      teamId: user.teamId || undefined,
    }
  } catch (error) {
    console.error('Authentication error in dashboard layout:', error)
    return null
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect('/login')
  }

  return <DashboardClientLayout user={user}>{children}</DashboardClientLayout>
}
