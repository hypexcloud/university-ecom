import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { consentLog } from '@/lib/server/db/schema'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = request.headers.get('user-agent') || null

    // Try to get authenticated user (optional — consent works for anonymous too)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const customerUid = user?.id || null

    const categories = ['essential', 'analytics', 'marketing'] as const

    for (const cat of categories) {
      if (body[cat] !== undefined) {
        await db.insert(consentLog).values({
          customerUid: customerUid || '00000000-0000-0000-0000-000000000000', // anonymous placeholder
          consentType: cat,
          granted: body[cat] === true,
          ip,
          userAgent,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
