import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { analyticsEvents } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin('customers')

    const events = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.name, 'intake_submission'))
      .orderBy(desc(analyticsEvents.occurredAt))
      .limit(100)

    const submissions = events.map((e) => ({
      id: String(e.id),
      ...(e.props as Record<string, unknown>),
    }))

    return NextResponse.json({ submissions })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
