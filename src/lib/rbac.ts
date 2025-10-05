export type Role = 'Owner' | 'Member'

export interface User {
  id: string
  role?: string
  teamId?: string
}

export function canManageTeam(user: User, teamId: string): boolean {
  return user.teamId === teamId && user.role === 'Owner'
}

export function canManageMembers(user: User, teamId: string): boolean {
  return user.teamId === teamId && user.role === 'Owner'
}

export function canManageBilling(user: User, teamId: string): boolean {
  return user.teamId === teamId && user.role === 'Owner'
}

export function canAccessTeam(user: User, teamId: string): boolean {
  return user.teamId === teamId
}

export function canManageItem(user: User, teamId: string): boolean {
  return user.teamId === teamId && user.role === 'Owner'
}
