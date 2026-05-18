import { NextRequest, NextResponse } from 'next/server'

const COOKIE_DAYS = parseInt(process.env.AFFILIATE_COOKIE_DAYS || '30', 10)

/**
 * Sets a referral cookie when ?ref=CODE is present.
 * Last-touch wins — overwrites any existing cookie.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('ref')

  if (!code) {
    return NextResponse.json({ error: 'Missing ref param' }, { status: 400 })
  }

  const response = NextResponse.json({ tracked: true, code })

  response.cookies.set('affiliate_ref', code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_DAYS * 24 * 60 * 60,
    path: '/',
  })

  return response
}
