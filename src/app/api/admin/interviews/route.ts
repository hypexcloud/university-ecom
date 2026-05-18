import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { interviews } from '@/lib/server/db/schema'
import { asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('videos')
    const items = await db.select().from(interviews).orderBy(asc(interviews.orderIndex))
    return NextResponse.json({ interviews: items })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().optional(),
  orderIndex: z.number().int().default(0),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('videos')
    const data = createSchema.parse(await request.json())
    const [item] = await db.insert(interviews).values(data).returning()
    return NextResponse.json({ success: true, interview: item }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
