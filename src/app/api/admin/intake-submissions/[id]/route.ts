import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { analyticsEvents } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'approved', 'rejected']),
  reviewNotes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin('customers')
    const { id } = await params
    const data = updateSchema.parse(await request.json())

    const [event] = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.id, parseInt(id, 10)))
      .limit(1)

    if (!event || event.name !== 'intake_submission') {
      return NextResponse.json({ error: 'Submission nicht gefunden' }, { status: 404 })
    }

    const currentProps = event.props as Record<string, unknown>
    await db.update(analyticsEvents).set({
      props: {
        ...currentProps,
        status: data.status,
        reviewNotes: data.reviewNotes || null,
        reviewedBy: admin.uid,
        reviewedAt: new Date().toISOString(),
      },
    }).where(eq(analyticsEvents.id, parseInt(id, 10)))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
