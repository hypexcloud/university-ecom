import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, customers } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET() {
  try {
    await requireAdmin('payments')

    const result = await db
      .select({
        id: orders.id,
        customerUid: orders.customerUid,
        totalCents: orders.totalCents,
        createdAt: orders.createdAt,
        customerEmail: customers.email,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
      })
      .from(orders)
      .innerJoin(customers, eq(orders.customerUid, customers.uid))
      .where(eq(orders.status, 'awaiting_crypto'))
      .orderBy(desc(orders.createdAt))

    return NextResponse.json({ orders: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
