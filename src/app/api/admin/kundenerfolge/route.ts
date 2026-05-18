import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { kundenerfolge } from '@/lib/server/db/schema'
import { asc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('products')
    const items = await db.select().from(kundenerfolge).orderBy(asc(kundenerfolge.orderIndex))
    return NextResponse.json({ kundenerfolge: items })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  mediaType: z.enum(['image', 'video']),
  mediaUrl: z.string().url(),
  orderIndex: z.number().int().default(0),
  customerUid: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const data = createSchema.parse(await request.json())
    const [item] = await db.insert(kundenerfolge).values(data).returning()
    return NextResponse.json({ success: true, item }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
