import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, customers } from '@/lib/server/db/schema'
import { eq, gte, lte, and, sql, count } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('analytics')

    const params = request.nextUrl.searchParams
    const type = params.get('type') || 'revenue'
    const from = params.get('from') || new Date(Date.now() - 30 * 86400000).toISOString()
    const to = params.get('to') || new Date().toISOString()
    const fromDate = new Date(from)
    const toDate = new Date(to)

    let csv = ''

    if (type === 'revenue') {
      csv = 'Datum,Umsatz (EUR)\n'
      const rows = await db
        .select({
          date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
          totalCents: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
        })
        .from(orders)
        .where(and(eq(orders.status, 'paid'), gte(orders.createdAt, fromDate), lte(orders.createdAt, toDate)))
        .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`)

      for (const r of rows) {
        csv += `${r.date},${(Number(r.totalCents) / 100).toFixed(2)}\n`
      }
    } else if (type === 'customers') {
      csv = 'Datum,Neue Kunden\n'
      const rows = await db
        .select({
          date: sql<string>`date_trunc('day', ${customers.createdAt})::date`,
          count: count(),
        })
        .from(customers)
        .where(and(gte(customers.createdAt, fromDate), lte(customers.createdAt, toDate)))
        .groupBy(sql`date_trunc('day', ${customers.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${customers.createdAt})::date`)

      for (const r of rows) {
        csv += `${r.date},${r.count}\n`
      }
    } else if (type === 'orders') {
      csv = 'Datum,Bestellungen\n'
      const rows = await db
        .select({
          date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
          count: count(),
        })
        .from(orders)
        .where(and(eq(orders.status, 'paid'), gte(orders.createdAt, fromDate), lte(orders.createdAt, toDate)))
        .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
        .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`)

      for (const r of rows) {
        csv += `${r.date},${r.count}\n`
      }
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${type}-${from.slice(0, 10)}-${to.slice(0, 10)}.csv"`,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
