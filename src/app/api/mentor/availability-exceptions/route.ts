import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { availabilityExceptions } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireMentor } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    const mentor = await requireMentor()
    const exceptions = await db
      .select()
      .from(availabilityExceptions)
      .where(eq(availabilityExceptions.mentorUid, mentor.uid))
    return NextResponse.json({ exceptions })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['block', 'available']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  reason: z.string().max(200).optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const mentor = await requireMentor()
    const data = createSchema.parse(await request.json())

    const [exception] = await db.insert(availabilityExceptions).values({
      mentorUid: mentor.uid,
      date: data.date,
      type: data.type,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      reason: data.reason ?? null,
    }).returning()

    return NextResponse.json({ exception }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const mentor = await requireMentor()
    const { id } = z.object({ id: z.string().uuid() }).parse(await request.json())

    await db.delete(availabilityExceptions).where(
      and(eq(availabilityExceptions.id, id), eq(availabilityExceptions.mentorUid, mentor.uid))
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
