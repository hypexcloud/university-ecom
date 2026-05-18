import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseWeeks } from '@/lib/server/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('products')
    const moduleId = request.nextUrl.searchParams.get('moduleId')
    const weeks = moduleId
      ? await db.select().from(courseWeeks).where(eq(courseWeeks.moduleId, moduleId)).orderBy(asc(courseWeeks.orderIndex))
      : await db.select().from(courseWeeks).orderBy(asc(courseWeeks.orderIndex))
    return NextResponse.json({ weeks })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  orderIndex: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const data = createSchema.parse(await request.json())
    const [week] = await db.insert(courseWeeks).values(data).returning()
    return NextResponse.json({ success: true, week }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
