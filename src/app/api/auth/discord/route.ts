import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || ''
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/discord/callback`

/**
 * Redirect to Discord OAuth2 authorize page.
 * Scope: identify (get user ID + username).
 */
export async function GET() {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: 'Discord OAuth not configured' }, { status: 503 })
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
  })

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}
