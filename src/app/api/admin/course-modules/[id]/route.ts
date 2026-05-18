import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseModules } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { z } from 'zod'

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  orderIndex: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin('products')
    const { id } = await params
    const data = patchSchema.parse(await request.json())
    await db.update(courseModules).set(data).where(eq(courseModules.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin('products')
    const { id } = await params
    await db.delete(courseModules).where(eq(courseModules.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
