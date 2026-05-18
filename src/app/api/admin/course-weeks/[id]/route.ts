import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseWeeks } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin('products')
    const { id } = await params
    await db.delete(courseWeeks).where(eq(courseWeeks.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
