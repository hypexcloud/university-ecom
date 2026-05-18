import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { communityPosts } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  category: z.enum(['news', 'updates', 'ankuendigungen', 'erfolge']).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const { id } = await params
    const data = patchSchema.parse(await request.json())
    await db.update(communityPosts).set({ ...data, updatedAt: new Date() }).where(eq(communityPosts.id, id))
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
    await db.delete(communityPosts).where(eq(communityPosts.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
