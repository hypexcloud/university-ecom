import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { notifications } from '@/lib/server/db/schema'
import { eq, desc, isNull, count } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET() {
  try {
    const user = await requireAuth()

    const items = await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientUid, user.uid))
      .orderBy(desc(notifications.createdAt))
      .limit(20)

    const [unread] = await db
      .select({ value: count() })
      .from(notifications)
      .where(
        eq(notifications.recipientUid, user.uid),
      )
      .where(isNull(notifications.readAt))

    return NextResponse.json({
      notifications: items,
      unreadCount: unread?.value ?? 0,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
