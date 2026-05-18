import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { courseModules } from '@/lib/server/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('products')
    const courseId = request.nextUrl.searchParams.get('courseId')
    const modules = courseId
      ? await db.select().from(courseModules).where(eq(courseModules.courseId, courseId)).orderBy(asc(courseModules.orderIndex))
      : await db.select().from(courseModules).orderBy(asc(courseModules.orderIndex))
    return NextResponse.json({ modules })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  orderIndex: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const data = createSchema.parse(await request.json())
    const [mod] = await db.insert(courseModules).values(data).returning()
    return NextResponse.json({ success: true, module: mod }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
