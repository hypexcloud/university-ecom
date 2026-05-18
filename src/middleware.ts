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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = path.startsWith('/admin') || path.startsWith('/student') || path.startsWith('/mentor')

  // 1. Redirect unauthenticated users away from protected routes
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  // 2. Role-based route gating (prevent students from accessing /admin, etc.)
  if (user && isProtected) {
    // Use a cookie to cache the role check (avoids DB query on every request)
    // Cache invalidates on sign-out (cookie cleared) or after 5 minutes
    let userRole = request.cookies.get('x-user-role')?.value

    if (!userRole) {
      // Query role from the app's API
      const roleUrl = new URL('/api/auth/role', request.url)
      try {
        const roleRes = await fetch(roleUrl, {
          headers: { cookie: request.headers.get('cookie') || '' },
        })
        if (roleRes.ok) {
          const data = await roleRes.json()
          userRole = data.role
          // Cache in response cookie (5 min TTL)
          supabaseResponse.cookies.set('x-user-role', userRole || 'student', {
            maxAge: 300,
            httpOnly: true,
            path: '/',
          })
        }
      } catch {
        userRole = 'student'
      }
    }

    // Admin routes: only admins
    if (path.startsWith('/admin') && !path.startsWith('/admin/mfa') && userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = userRole === 'mentor' ? '/mentor' : '/student'
      return NextResponse.redirect(url)
    }

    // Mentor routes: admins and mentors
    if (path.startsWith('/mentor') && userRole !== 'mentor' && userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
  }

  // 3. MFA enforcement for admin routes
  if (user && path.startsWith('/admin') && !path.startsWith('/admin/mfa')) {
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (!mfaData || mfaData.currentLevel !== 'aal2') {
      const url = request.nextUrl.clone()
      url.pathname = mfaData?.nextLevel === 'aal2' ? '/admin/mfa/verify' : '/admin/mfa/enroll'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
