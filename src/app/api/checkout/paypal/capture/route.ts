import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder } from '@/lib/server/paypal'
import { fulfillOrder } from '@/lib/server/order-processing'
import { db } from '@/lib/server/db'
import { auditLog } from '@/lib/server/db/schema'
import { emitNotification } from '@/lib/server/notifications'
import { z } from 'zod'

const bodySchema = z.object({
  orderId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const { orderId } = bodySchema.parse(await request.json())

    const capture = await capturePayPalOrder(orderId)

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Zahlung nicht abgeschlossen: ${capture.status}` }, { status: 400 })
    }

    // Parse our metadata from custom_id
    let meta: { uid?: string; pid?: string; aff?: string } = {}
    try {
      meta = JSON.parse(capture.customId)
    } catch {
      return NextResponse.json({ error: 'Ungültige Zahlungsmetadaten' }, { status: 400 })
    }

    if (!meta.uid || !meta.pid) {
      return NextResponse.json({ error: 'Fehlende Zahlungsmetadaten' }, { status: 400 })
    }

    const totalCents = Math.round(parseFloat(capture.amountValue) * 100)

    const result = await fulfillOrder({
      customerUid: meta.uid,
      planId: meta.pid,
      totalCents,
      provider: 'paypal',
      providerRef: capture.captureId,
      affiliateCode: meta.aff || null,
    })

    await db.insert(auditLog).values({
      actorUid: meta.uid,
      action: 'order.paid',
      targetType: 'order',
      targetId: result.orderId,
      after: {
        paypalOrderId: orderId,
        captureId: capture.captureId,
        invoiceNumber: result.invoiceNumber,
        amount: totalCents,
      },
    })

    await emitNotification({
      recipientUid: meta.uid,
      event: 'invoice_ready',
      title: `Rechnung ${result.invoiceNumber} erstellt`,
      body: `Deine PayPal-Zahlung über ${capture.amountValue} € wurde bestätigt.`,
      link: '/student',
    }).catch(() => {})

    return NextResponse.json({ success: true, orderId: result.orderId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
