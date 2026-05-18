import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { giftcards } from '@/lib/server/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin('payments')
    const cards = await db.select().from(giftcards).orderBy(desc(giftcards.createdAt))
    return NextResponse.json({ giftcards: cards })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
