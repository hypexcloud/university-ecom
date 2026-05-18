import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { affiliateLinks } from '@/lib/server/db/schema'
import { nanoid } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, approved } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!approved) {
      return NextResponse.json({ success: true, message: 'Application rejected' })
    }

    // Create affiliate link for the approved user
    const code = `AFF-${nanoid(8).toUpperCase()}`

    await db.insert(affiliateLinks).values({
      customerUid: userId,
      code,
      commissionRate: '0.1500',
    })

    return NextResponse.json({ success: true, message: 'Affiliate approved' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
