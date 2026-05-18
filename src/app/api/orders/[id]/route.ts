import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, orderItems, invoices, plans, products } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
    if (!order || order.customerUid !== user.uid) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 })
    }

    const items = await db
      .select({
        id: orderItems.id,
        priceCents: orderItems.priceCents,
        planCode: plans.code,
        productTitle: products.title,
      })
      .from(orderItems)
      .innerJoin(plans, eq(orderItems.planId, plans.id))
      .innerJoin(products, eq(plans.productId, products.id))
      .where(eq(orderItems.orderId, id))

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, id))
      .limit(1)

    return NextResponse.json({
      order: {
        id: order.id,
        totalCents: order.totalCents,
        currency: order.currency,
        status: order.status,
        provider: order.provider,
        createdAt: order.createdAt,
      },
      items,
      invoice: invoice ? { number: invoice.number, pdfUrl: invoice.pdfUrl } : null,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
