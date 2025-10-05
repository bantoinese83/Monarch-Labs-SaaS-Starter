import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from './auth'
import { jsonError } from './http'

export async function requireUser(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return { error: jsonError('Unauthorized', 401) as Response, user: null }
  }
  return { error: null, user }
}
