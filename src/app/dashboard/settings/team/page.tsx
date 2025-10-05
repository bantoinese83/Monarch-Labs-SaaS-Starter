'use client'

import { useState, useEffect } from 'react'
import { Trash2, User, Mail, Crown } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

interface Team {
  id: string
  name: string
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

export default function TeamSettingsPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('Member')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/teams/current')
      if (response.ok) {
        const data = await response.json()
        setTeam(data.team)
        setTeamName(data.team.name)
      }
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError('')

    try {
      const response = await fetch('/api/teams/current', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: teamName }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update team')
      }

      const data = await response.json()
      setTeam(data.team)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingMember(true)
    setError('')

    try {
      const response = await fetch('/api/teams/current/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add member')
      }

      const data = await response.json()
      setTeam(prev =>
        prev
          ? {
              ...prev,
              members: [...prev.members, data.member],
            }
          : null,
      )
      setNewMemberEmail('')
      setNewMemberRole('Member')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      const response = await fetch(`/api/teams/current/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove member')
      }

      setTeam(prev =>
        prev
          ? {
              ...prev,
              members: prev.members.filter(member => member.id !== memberId),
            }
          : null,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/teams/current/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update member role')
      }

      const data = await response.json()
      setTeam(prev =>
        prev
          ? {
              ...prev,
              members: prev.members.map(member => (member.id === memberId ? data.member : member)),
            }
          : null,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-black/30 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="grunge-paper p-6 rounded-lg">
              <div className="h-4 bg-black/30 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-black/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl grunge-headline">Team Settings</h1>
        <p className="text-gray-300 grunge-ink">Manage your team members and settings</p>
      </div>

      {error && (
        <div className="mb-6 grunge-border bg-red-900/20 p-4 text-red-300">
          <div className="text-sm">{error}</div>
        </div>
      )}

      <div className="space-y-8">
        {/* Team Information */}
        <div className="grunge-paper p-6 rounded-lg">
          <h2 className="text-lg grunge-headline mb-4">Team Information</h2>
          <form onSubmit={handleUpdateTeam} className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm text-gray-300">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Enter team name"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-md grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Team'}
            </button>
          </form>
        </div>

        {/* Add Member */}
        <div className="grunge-paper p-6 rounded-lg" id="add-member">
          <h2 className="text-lg grunge-headline mb-4">Add Team Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="memberEmail" className="block text-sm text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="memberEmail"
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="memberRole" className="block text-sm text-gray-300">
                  Role
                </label>
                <select
                  id="memberRole"
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 grunge-border rounded-md bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  <option value="Member">Member</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isAddingMember}
              className="px-4 py-2 rounded-md grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600 disabled:opacity-50"
            >
              {isAddingMember ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </div>

        {/* Team Members */}
        <div className="grunge-paper p-6 rounded-lg">
          <h2 className="text-lg grunge-headline mb-4">Team Members</h2>
          {!team?.members?.length ? (
            <EmptyState
              icon={<User className="h-12 w-12" />}
              title="No team members yet"
              description="Invite your first teammate to collaborate."
              actionHref="#add-member"
              actionLabel="Invite Member"
            />
          ) : (
            <div className="space-y-4">
              {team.members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 grunge-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center grunge-border">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="grunge-headline">{member.user.name}</span>
                        {member.role === 'Owner' && <Crown className="h-4 w-4 text-yellow-300" />}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span>{member.user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={member.role}
                      onChange={e => handleUpdateMemberRole(member.id, e.target.value)}
                      className="px-3 py-1 grunge-border rounded-md text-sm bg-black/40 text-gray-200 focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Owner">Owner</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
