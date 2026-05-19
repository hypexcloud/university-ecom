import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sessions, entitlements, plans } from '@/lib/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const bookSchema = z.object({
  mentorUid: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  type: z.enum(['zoom', 'meet', 'discord']).default('zoom'),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const data = bookSchema.parse(await request.json())

    // Verify 1:1 entitlement
    const entitled = await db
      .select({ planCode: plans.code })
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))

    const has1to1 = entitled.some((e) =>
      ['business', 'infinity', 'tiktok', 'youtube'].includes(e.planCode),
    )

    if (!has1to1) {
      return NextResponse.json({ error: 'Kein 1:1-Zugang' }, { status: 403 })
    }

    // Check Infinity = unlimited, Business = max 3 sessions
    const isInfinity = entitled.some((e) => e.planCode === 'infinity')
    if (!isInfinity) {
      const existingCount = await db
        .select({ id: sessions.id })
        .from(sessions)
        .where(and(eq(sessions.customerUid, user.uid)))

      // Business plans get 3 sessions total (per Lastenheft)
      if (existingCount.length >= 3) {
        return NextResponse.json({ error: 'Maximale Anzahl an Sessions erreicht (3). Upgrade auf Infinity für unbegrenzte Sessions.' }, { status: 400 })
      }
    }

    const [session] = await db.insert(sessions).values({
      customerUid: user.uid,
      mentorUid: data.mentorUid,
      type: data.type,
      status: 'pending',
      scheduledAt: new Date(data.scheduledAt),
    }).returning()

    // Notify mentor
    await emitNotification({
      recipientUid: data.mentorUid,
      event: 'appointment_created',
      title: 'Neue Session-Buchung',
      body: `${user.customer.firstName} hat eine Session am ${new Date(data.scheduledAt).toLocaleDateString('de-DE')} gebucht.`,
      link: `/mentor/sessions/${session.id}`,
    }).catch(() => {})

    return NextResponse.json({ success: true, session }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
