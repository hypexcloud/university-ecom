import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { customers, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || ''
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || ''
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/discord/callback`

/**
 * Discord OAuth2 callback: exchange code → fetch user → save discord_user_id.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code || !CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.redirect(new URL('/student/profile?discord=error', request.url))
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/student/profile?discord=error', request.url))
    }

    const { access_token } = await tokenRes.json()

    // Fetch Discord user
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    if (!userRes.ok) {
      return NextResponse.redirect(new URL('/student/profile?discord=error', request.url))
    }

    const discordUser = await userRes.json()

    // Get authenticated app user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Save discord_user_id to customer
    await db
      .update(customers)
      .set({
        discordUserId: discordUser.id,
        discordUsername: `${discordUser.username}${discordUser.discriminator !== '0' ? '#' + discordUser.discriminator : ''}`,
        updatedAt: new Date(),
      })
      .where(eq(customers.uid, user.id))

    await db.insert(auditLog).values({
      actorUid: user.id,
      action: 'discord.linked',
      targetType: 'customer',
      targetId: user.id,
      after: { discordUserId: discordUser.id, discordUsername: discordUser.username },
    })

    return NextResponse.redirect(new URL('/student/profile?discord=success', request.url))
  } catch {
    return NextResponse.redirect(new URL('/student/profile?discord=error', request.url))
  }
}
