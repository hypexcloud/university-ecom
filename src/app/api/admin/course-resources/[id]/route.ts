import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseResources } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: resourceId } = await params

    await db.delete(courseResources).where(eq(courseResources.id, resourceId))

    return NextResponse.json({ success: true, message: 'Resource deleted' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
