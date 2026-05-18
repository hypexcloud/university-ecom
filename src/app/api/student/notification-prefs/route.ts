import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'

// Notification preferences stored in customers.billing.notificationPrefs JSONB

export async function GET() {
  try {
    const user = await requireAuth()
    const [customer] = await db.select({ billing: customers.billing }).from(customers).where(eq(customers.uid, user.uid)).limit(1)
    const prefs = (customer?.billing as Record<string, unknown>)?.notificationPrefs || {}
    return NextResponse.json({ prefs })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ prefs: {} })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const user = await requireAuth()
    const prefs = await request.json()

    const [customer] = await db.select({ billing: customers.billing }).from(customers).where(eq(customers.uid, user.uid)).limit(1)
    const currentBilling = (customer?.billing as Record<string, unknown>) || {}

    await db.update(customers).set({
      billing: { ...currentBilling, notificationPrefs: prefs },
      updatedAt: new Date(),
    }).where(eq(customers.uid, user.uid))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
