import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, orderItems } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { fulfillOrder } from '@/lib/server/order-processing'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.literal('paid'),
  txHash: z.string().min(1),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const admin = await requireAdmin('payments')
    const { id } = await params
    const data = patchSchema.parse(await request.json())

    // Get order
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
    if (!order) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 })
    }
    if (order.status !== 'awaiting_crypto') {
      return NextResponse.json({ error: 'Bestellung nicht im Crypto-Wartestatus' }, { status: 400 })
    }

    // Get order items for the plan
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
    if (items.length === 0) {
      return NextResponse.json({ error: 'Keine Positionen gefunden' }, { status: 400 })
    }

    // Update order status
    await db.update(orders).set({
      status: 'paid',
      providerRef: data.txHash,
      metadata: { txHash: data.txHash, confirmedBy: admin.uid },
    }).where(eq(orders.id, id))

    // Fulfill: create entitlements + invoice (reuse fulfillOrder logic for entitlements)
    // Since order already exists, just grant entitlements directly
    const { fulfillCryptoOrder } = await import('@/lib/server/crypto-fulfillment')
    await fulfillCryptoOrder(order.customerUid, items[0].planId, id, admin.uid)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
