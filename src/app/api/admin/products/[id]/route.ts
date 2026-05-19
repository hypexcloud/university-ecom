import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { products, plans, auditLog } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const admin = await requireAdmin('products')
    const { id } = await params
    const data = patchProductSchema.parse(await request.json())

    const [before] = await db.select().from(products).where(eq(products.id, id)).limit(1)
    if (!before) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 })

    await db.update(products).set(data).where(eq(products.id, id))

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'product.update',
      targetType: 'product',
      targetId: id,
      before: { title: before.title, isActive: before.isActive },
      after: data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
