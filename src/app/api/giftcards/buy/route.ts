import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { giftcards } from '@/lib/server/db/schema'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { nanoid } from '@/lib/utils'
import { z } from 'zod'
import { Resend } from 'resend'

const buySchema = z.object({
  amountCents: z.number().int().min(1000).max(100000), // 10€ – 1000€
  recipientEmail: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    const user = await requireAuth()
    const data = buySchema.parse(await request.json())

    const code = `GC-${nanoid(10).toUpperCase()}`

    const [card] = await db.insert(giftcards).values({
      code,
      initialCents: data.amountCents,
      balanceCents: data.amountCents,
      buyerUid: user.uid,
      recipientEmail: data.recipientEmail,
      status: 'active',
    }).returning()

    // Send email to recipient
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const fromEmail = process.env.EMAIL_FROM_EMAIL || 'noreply@university-ecom.vercel.app'
      const fromName = process.env.EMAIL_FROM_NAME || 'University Ecom'

      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: data.recipientEmail,
        subject: 'Du hast einen Gutschein erhalten!',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#D4AF37;">University Ecom Gutschein</h2>
            <p>Jemand hat dir einen Gutschein über <strong>${(data.amountCents / 100).toFixed(2)} €</strong> geschenkt!</p>
            <p style="font-size:24px;font-weight:bold;background:#f5f5f5;padding:16px;text-align:center;border-radius:8px;letter-spacing:2px;">${code}</p>
            <p>Löse den Code beim Checkout auf <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://university-ecom.com'}">University Ecom</a> ein.</p>
          </div>
        `,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, giftcard: { id: card.id, code } }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
