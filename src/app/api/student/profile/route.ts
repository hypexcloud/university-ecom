import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  discordUsername: z.string().optional(),
  whatsapp: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    }
    const user = await requireAuth()
    const data = updateSchema.parse(await request.json())

    await db.update(customers).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(customers.uid, user.uid))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
