import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { communityPosts } from '@/lib/server/db/schema'
import { desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('products')
    const posts = await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt))
    return NextResponse.json({ posts })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  category: z.enum(['news', 'updates', 'ankuendigungen', 'erfolge']),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  mediaUrls: z.array(z.string().url()).optional(),
  publishNow: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const admin = await requireAdmin('products')
    const data = createSchema.parse(await request.json())

    const [post] = await db.insert(communityPosts).values({
      authorUid: admin.uid,
      category: data.category,
      title: data.title,
      body: data.body,
      mediaUrls: data.mediaUrls || null,
      publishedAt: data.publishNow ? new Date() : null,
    }).returning()

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
