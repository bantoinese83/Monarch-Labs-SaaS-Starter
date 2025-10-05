// Client-side middleware to automatically add auth token to requests
if (typeof window !== 'undefined') {
  // Override fetch to automatically add auth token
  const originalFetch = window.fetch
  
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const token = localStorage.getItem('auth-token')
    
    if (token && init) {
      const headers = new Headers(init.headers)
      headers.set('x-auth-token', token)
      init.headers = headers
    } else if (token) {
      init = {
        ...init,
        headers: {
          ...init?.headers,
          'x-auth-token': token,
        },
      }
    }
    
    return originalFetch.call(this, input, init)
  }
}
