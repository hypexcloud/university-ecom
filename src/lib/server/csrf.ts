import { NextRequest } from 'next/server'

/**
 * Verify Origin header matches the app to prevent CSRF on state-changing requests.
 * Returns true if safe, false if suspicious.
 */
export function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // Requests without Origin (same-origin non-CORS) are safe in modern browsers
  if (!origin) return true

  // Verify origin matches the host
  try {
    const originHost = new URL(origin).host
    return originHost === host
  } catch {
    return false
  }
}
