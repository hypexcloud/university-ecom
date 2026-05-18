import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/server/rate-limit'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rate limiting on sensitive API routes
  if (path.startsWith('/api/auth/')) {
    const blocked = await checkRateLimit(request, { limit: 10, window: '1 m', prefix: 'auth' })
    if (blocked) return blocked
  } else if (path.startsWith('/api/checkout/')) {
    const blocked = await checkRateLimit(request, { limit: 5, window: '1 m', prefix: 'checkout' })
    if (blocked) return blocked
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the auth token — this is the main purpose of the middleware.
  // Do NOT add logic between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from protected routes
  if (!user && (path.startsWith('/admin') || path.startsWith('/student'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  // Block admin routes if MFA not satisfied.
  // Distinguish between "no TOTP enrolled" (→ enroll page) and
  // "enrolled but not verified this session" (→ verify page).
  if (user && path.startsWith('/admin') && !path.startsWith('/admin/mfa')) {
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (!mfaData || mfaData.currentLevel !== 'aal2') {
      const url = request.nextUrl.clone()
      // If nextLevel is aal2, user has a factor but hasn't verified → verify page
      // If nextLevel is aal1, user has no factor enrolled → enroll page
      if (mfaData?.nextLevel === 'aal2') {
        url.pathname = '/admin/mfa/verify'
      } else {
        url.pathname = '/admin/mfa/enroll'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
