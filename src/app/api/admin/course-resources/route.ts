import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseResources } from '@/lib/server/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('products')
    const weekId = request.nextUrl.searchParams.get('weekId')
    const resources = weekId
      ? await db.select().from(courseResources).where(eq(courseResources.weekId, weekId)).orderBy(asc(courseResources.orderIndex))
      : await db.select().from(courseResources).orderBy(asc(courseResources.orderIndex))
    return NextResponse.json({ resources })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  weekId: z.string().uuid(),
  title: z.string().min(1),
  type: z.enum(['video', 'pdf', 'link', 'quiz']),
  url: z.string().optional(),
  duration: z.number().int().optional(),
  orderIndex: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const data = createSchema.parse(await request.json())
    const [res] = await db.insert(courseResources).values(data).returning()
    return NextResponse.json({ success: true, resource: res }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
