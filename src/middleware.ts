import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/server/rate-limit'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rate limiting
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
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = path.startsWith('/admin') || path.startsWith('/student') || path.startsWith('/mentor')

  // 1. Unauthenticated → login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  // 2. Role gating via cookie only (no internal fetch — avoids DB connection conflicts)
  if (user && isProtected) {
    const userRole = request.cookies.get('x-user-role')?.value
    if (userRole) {
      if (path.startsWith('/admin') && !path.startsWith('/admin/mfa') && userRole !== 'admin') {
        return NextResponse.redirect(new URL(userRole === 'mentor' ? '/mentor' : '/student', request.url))
      }
      if (path.startsWith('/mentor') && userRole !== 'mentor' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/student', request.url))
      }
    }
  }

  // 3. MFA for admin
  if (user && path.startsWith('/admin') && !path.startsWith('/admin/mfa')) {
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (!mfaData || mfaData.currentLevel !== 'aal2') {
      return NextResponse.redirect(new URL(
        mfaData?.nextLevel === 'aal2' ? '/admin/mfa/verify' : '/admin/mfa/enroll',
        request.url,
      ))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
