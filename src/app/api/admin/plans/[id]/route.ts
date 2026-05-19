import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { plans, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchPlanSchema = z.object({
  priceCents: z.number().int().min(0).optional(),
  features: z.any().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const admin = await requireAdmin('products')
    const { id } = await params
    const data = patchPlanSchema.parse(await request.json())

    const [before] = await db.select().from(plans).where(eq(plans.id, id)).limit(1)
    if (!before) return NextResponse.json({ error: 'Plan nicht gefunden' }, { status: 404 })

    const updates: Record<string, unknown> = {}
    if (data.priceCents !== undefined) updates.priceCents = data.priceCents
    if (data.features !== undefined) updates.features = data.features

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Keine Änderungen' }, { status: 400 })
    }

    await db.update(plans).set(updates).where(eq(plans.id, id))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'plan.update',
      targetType: 'plan',
      targetId: id,
      before: { priceCents: before.priceCents, features: before.features },
      after: updates,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
