import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availability, sessions, mentors, customers, entitlements, plans } from '@/lib/server/db/schema'
import { eq, and, isNull, gte, lte } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

const DAY_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
}

const WEEKS_AHEAD = 2

export async function GET() {
  try {
    const user = await requireAuth()

    // Verify user has Business or Infinity entitlement (includes 1:1)
    const entitled = await db
      .select({ planCode: plans.code })
      .from(entitlements)
      .innerJoin(plans, eq(entitlements.planId, plans.id))
      .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))

    const has1to1 = entitled.some((e) =>
      ['business', 'infinity', 'tiktok', 'youtube'].includes(e.planCode),
    )

    if (!has1to1) {
      return NextResponse.json({ error: 'Kein 1:1-Zugang. Upgrade auf Business oder Infinity.' }, { status: 403 })
    }

    // Get all active mentor availability slots
    const allSlots = await db
      .select({
        mentorUid: availability.mentorUid,
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        mentorFirstName: customers.firstName,
      })
      .from(availability)
      .innerJoin(mentors, eq(availability.mentorUid, mentors.uid))
      .innerJoin(customers, eq(availability.mentorUid, customers.uid))
      .where(and(eq(availability.isActive, true), eq(mentors.isActive, true)))

    if (allSlots.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    // Get existing sessions for next 2 weeks to find conflicts
    const now = new Date()
    const endDate = new Date(now.getTime() + WEEKS_AHEAD * 7 * 86400000)

    const existingSessions = await db
      .select({ mentorUid: sessions.mentorUid, scheduledAt: sessions.scheduledAt })
      .from(sessions)
      .where(and(
        gte(sessions.scheduledAt, now),
        lte(sessions.scheduledAt, endDate),
        eq(sessions.status, 'accepted'),
      ))

    const bookedSet = new Set(
      existingSessions.map((s) => `${s.mentorUid}_${s.scheduledAt.toISOString().slice(0, 16)}`),
    )

    // Generate concrete datetime slots for next 2 weeks
    const result: { date: string; time: string; mentorUid: string; mentorName: string; iso: string }[] = []

    for (let dayOffset = 1; dayOffset <= WEEKS_AHEAD * 7; dayOffset++) {
      const date = new Date(now)
      date.setDate(date.getDate() + dayOffset)
      date.setHours(0, 0, 0, 0)
      const dayNum = date.getDay()

      for (const slot of allSlots) {
        if (DAY_MAP[slot.dayOfWeek] !== dayNum) continue

        // Generate hourly slots between start and end
        const [startH, startM] = slot.startTime.split(':').map(Number)
        const [endH] = slot.endTime.split(':').map(Number)

        for (let h = startH; h < endH; h++) {
          const slotDate = new Date(date)
          slotDate.setHours(h, startM || 0, 0, 0)

          if (slotDate <= now) continue // skip past slots

          const key = `${slot.mentorUid}_${slotDate.toISOString().slice(0, 16)}`
          if (bookedSet.has(key)) continue // already booked

          result.push({
            date: slotDate.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }),
            time: slotDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            mentorUid: slot.mentorUid,
            mentorName: slot.mentorFirstName,
            iso: slotDate.toISOString(),
          })
        }
      }
    }

    // Sort by date
    result.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime())

    return NextResponse.json({ slots: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
