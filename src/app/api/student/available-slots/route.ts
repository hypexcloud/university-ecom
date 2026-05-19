import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availability, availabilityExceptions, sessions, mentors, customers, entitlements, plans } from '@/lib/server/db/schema'
import { eq, and, isNull, gte, lte } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

const DAY_MAP: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
}

const WEEKS_AHEAD = 4

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

    // Get all active mentor UIDs for exception lookup
    const activeMentorUids = [...new Set(allSlots.map((s) => s.mentorUid))]

    // Get exceptions for the next N weeks
    const now = new Date()
    const endDate = new Date(now.getTime() + WEEKS_AHEAD * 7 * 86400000)
    const nowDateStr = now.toISOString().slice(0, 10)
    const endDateStr = endDate.toISOString().slice(0, 10)

    const allExceptions = activeMentorUids.length > 0
      ? await db
          .select()
          .from(availabilityExceptions)
          .where(and(
            gte(availabilityExceptions.date, nowDateStr),
            lte(availabilityExceptions.date, endDateStr),
          ))
      : []

    // Index exceptions by mentor+date for fast lookup
    const blocksByMentorDate = new Map<string, { startTime: string | null; endTime: string | null }[]>()
    const extraSlotsByMentorDate = new Map<string, { startTime: string; endTime: string; mentorUid: string }[]>()

    for (const exc of allExceptions) {
      const key = `${exc.mentorUid}_${exc.date}`
      if (exc.type === 'block') {
        if (!blocksByMentorDate.has(key)) blocksByMentorDate.set(key, [])
        blocksByMentorDate.get(key)!.push({ startTime: exc.startTime, endTime: exc.endTime })
      } else if (exc.type === 'available' && exc.startTime && exc.endTime) {
        if (!extraSlotsByMentorDate.has(key)) extraSlotsByMentorDate.set(key, [])
        extraSlotsByMentorDate.get(key)!.push({ startTime: exc.startTime, endTime: exc.endTime, mentorUid: exc.mentorUid })
      }
    }

    // Get existing sessions to find conflicts
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

    // Helper: is a specific hour blocked?
    function isHourBlocked(mentorUid: string, dateStr: string, hour: number): boolean {
      const key = `${mentorUid}_${dateStr}`
      const blocks = blocksByMentorDate.get(key)
      if (!blocks) return false
      for (const b of blocks) {
        if (!b.startTime || !b.endTime) return true // whole-day block
        const [bStartH] = b.startTime.split(':').map(Number)
        const [bEndH] = b.endTime.split(':').map(Number)
        if (hour >= bStartH && hour < bEndH) return true
      }
      return false
    }

    // Mentor name lookup for extra slots
    const mentorNames = new Map(allSlots.map((s) => [s.mentorUid, s.mentorFirstName]))

    const result: { date: string; time: string; mentorUid: string; mentorName: string; iso: string }[] = []

    for (let dayOffset = 1; dayOffset <= WEEKS_AHEAD * 7; dayOffset++) {
      const date = new Date(now)
      date.setDate(date.getDate() + dayOffset)
      date.setHours(0, 0, 0, 0)
      const dayNum = date.getDay()
      const dateStr = date.toISOString().slice(0, 10)

      // 1) Recurring slots (minus blocks)
      for (const slot of allSlots) {
        if (DAY_MAP[slot.dayOfWeek] !== dayNum) continue

        const [startH, startM] = slot.startTime.split(':').map(Number)
        const [endH] = slot.endTime.split(':').map(Number)

        for (let h = startH; h < endH; h++) {
          if (isHourBlocked(slot.mentorUid, dateStr, h)) continue

          const slotDate = new Date(date)
          slotDate.setHours(h, startM || 0, 0, 0)
          if (slotDate <= now) continue

          const key = `${slot.mentorUid}_${slotDate.toISOString().slice(0, 16)}`
          if (bookedSet.has(key)) continue

          result.push({
            date: slotDate.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }),
            time: slotDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            mentorUid: slot.mentorUid,
            mentorName: slot.mentorFirstName,
            iso: slotDate.toISOString(),
          })
        }
      }

      // 2) Extra one-off slots from exceptions
      for (const [key, extras] of extraSlotsByMentorDate) {
        if (!key.endsWith(`_${dateStr}`)) continue
        for (const extra of extras) {
          const [startH] = extra.startTime.split(':').map(Number)
          const [endH] = extra.endTime.split(':').map(Number)

          for (let h = startH; h < endH; h++) {
            const slotDate = new Date(date)
            slotDate.setHours(h, 0, 0, 0)
            if (slotDate <= now) continue

            const bkey = `${extra.mentorUid}_${slotDate.toISOString().slice(0, 16)}`
            if (bookedSet.has(bkey)) continue

            // Avoid duplicates if recurring already covers this hour
            const isDuplicate = result.some((r) => r.iso === slotDate.toISOString() && r.mentorUid === extra.mentorUid)
            if (isDuplicate) continue

            result.push({
              date: slotDate.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }),
              time: slotDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
              mentorUid: extra.mentorUid,
              mentorName: mentorNames.get(extra.mentorUid) ?? 'Mentor',
              iso: slotDate.toISOString(),
            })
          }
        }
      }
    }

    result.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime())

    return NextResponse.json({ slots: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
