import { NextRequest, NextResponse } from 'next/server'
import { addRole, removeRole } from '@/lib/server/discord'
import { z } from 'zod'

const API_KEY = process.env.DISCORD_INTERNAL_API_KEY || ''

const syncSchema = z.object({
  discordUserId: z.string().min(1),
  action: z.enum(['add', 'remove']),
  role: z.enum(['fast', 'business', 'infinity', 'tiktok', 'youtube', 'affiliate']),
})

/**
 * Internal API for role sync. Authenticated via API key, not user JWT.
 * Called by the main app after entitlement changes, or by the bot service.
 */
export async function POST(request: NextRequest) {
  // API key auth
  const authHeader = request.headers.get('authorization')
  if (!API_KEY || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = syncSchema.parse(await request.json())

    const success = data.action === 'add'
      ? await addRole(data.discordUserId, data.role)
      : await removeRole(data.discordUserId, data.role)

    return NextResponse.json({ success, role: data.role, action: data.action })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
