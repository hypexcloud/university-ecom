import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { giftcards } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const redeemSchema = z.object({
  code: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAuth()
    const { code } = redeemSchema.parse(await request.json())

    const [card] = await db
      .select()
      .from(giftcards)
      .where(and(eq(giftcards.code, code.toUpperCase()), eq(giftcards.status, 'active')))
      .limit(1)

    if (!card) {
      return NextResponse.json({ error: 'Ungültiger oder abgelaufener Gutscheincode' }, { status: 404 })
    }

    if (card.balanceCents <= 0) {
      return NextResponse.json({ error: 'Gutschein bereits vollständig eingelöst' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      code: card.code,
      balanceCents: card.balanceCents,
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
