import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { interviews } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().optional(),
  orderIndex: z.number().int().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('videos')
    const { id } = await params
    const data = patchSchema.parse(await request.json())
    await db.update(interviews).set(data).where(eq(interviews.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin('videos')
    const { id } = await params
    await db.delete(interviews).where(eq(interviews.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
