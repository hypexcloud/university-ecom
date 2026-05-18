import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availability } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coachId, slots } = body

    if (!coachId || !slots) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Delete existing slots for this mentor, then insert new ones
    await db.delete(availability).where(eq(availability.mentorUid, coachId))

    if (Array.isArray(slots) && slots.length > 0) {
      await db.insert(availability).values(
        slots.map((slot: { dayOfWeek: string; startTime: string; endTime: string }) => ({
          mentorUid: coachId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        })),
      )
    }

    return NextResponse.json({ success: true, message: 'Availability saved successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
