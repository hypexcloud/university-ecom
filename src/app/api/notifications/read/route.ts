import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { notifications } from '@/lib/server/db/schema'
import { eq, and, isNull, inArray } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const readSchema = z.union([
  z.object({ ids: z.array(z.string().uuid()) }),
  z.object({ all: z.literal(true) }),
])

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const body = readSchema.parse(await request.json())
    const now = new Date()

    if ('all' in body) {
      await db
        .update(notifications)
        .set({ readAt: now })
        .where(and(
          eq(notifications.recipientUid, user.uid),
          isNull(notifications.readAt),
        ))
    } else {
      await db
        .update(notifications)
        .set({ readAt: now })
        .where(and(
          eq(notifications.recipientUid, user.uid),
          inArray(notifications.id, body.ids),
          isNull(notifications.readAt),
        ))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
