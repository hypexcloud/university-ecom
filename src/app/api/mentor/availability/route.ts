import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availability } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireMentor } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    const mentor = await requireMentor()
    const slots = await db.select().from(availability).where(eq(availability.mentorUid, mentor.uid))
    return NextResponse.json({ slots })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const slotSchema = z.object({
  slots: z.array(z.object({
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const mentor = await requireMentor()
    const { slots } = slotSchema.parse(await request.json())

    // Replace all slots
    await db.delete(availability).where(eq(availability.mentorUid, mentor.uid))

    if (slots.length > 0) {
      await db.insert(availability).values(
        slots.map((s) => ({ mentorUid: mentor.uid, dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, isActive: true })),
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
