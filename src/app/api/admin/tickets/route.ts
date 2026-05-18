import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { tickets, customers } from '@/lib/server/db/schema'
import { eq, desc, and, SQL } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('tickets')

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const conditions: SQL[] = []
    if (status && status !== 'alle') {
      conditions.push(eq(tickets.status, status))
    }
    if (category) {
      conditions.push(eq(tickets.category, category))
    }

    const result = await db
      .select({
        id: tickets.id,
        category: tickets.category,
        subject: tickets.subject,
        status: tickets.status,
        assigneeUid: tickets.assigneeUid,
        lastMessageAt: tickets.lastMessageAt,
        createdAt: tickets.createdAt,
        customerUid: tickets.customerUid,
        customerEmail: customers.email,
        customerFirstName: customers.firstName,
        customerLastName: customers.lastName,
      })
      .from(tickets)
      .innerJoin(customers, eq(tickets.customerUid, customers.uid))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tickets.lastMessageAt))
      .limit(100)

    return NextResponse.json({ tickets: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
