import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseResources } from '@/lib/server/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    const weekId = request.nextUrl.searchParams.get('weekId')

    if (!weekId) {
      return NextResponse.json({ error: 'weekId required' }, { status: 400 })
    }

    const resources = await db
      .select()
      .from(courseResources)
      .where(eq(courseResources.weekId, weekId))
      .orderBy(asc(courseResources.orderIndex))

    return NextResponse.json({ resources })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
