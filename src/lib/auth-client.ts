// Client-side authentication utilities
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  // Try localStorage first
  const token = localStorage.getItem('auth-token')
  if (token) return token
  
  // Try to get from cookies as fallback
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(c => c.trim().startsWith('auth-token='))
  if (authCookie) {
    return authCookie.split('=')[1]
  }
  
  return null
}

export function getAuthUser(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('auth-user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  
  return null
}

export function setAuthToken(token: string, user: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('auth-token', token)
  localStorage.setItem('auth-user', JSON.stringify(user))
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('auth-token')
  localStorage.removeItem('auth-user')
}

// Add token to fetch requests
export function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()
  
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('x-auth-token', token)
  }
  
  return fetch(url, {
    ...options,
    headers,
  })
}
