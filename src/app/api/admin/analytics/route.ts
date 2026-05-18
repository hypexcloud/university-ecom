import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, customers, tickets, sessions, affiliateReferrals, orderItems, plans, products } from '@/lib/server/db/schema'
import { eq, gte, lte, and, sql, count } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('analytics')

    const params = request.nextUrl.searchParams
    const from = params.get('from') || new Date(Date.now() - 30 * 86400000).toISOString()
    const to = params.get('to') || new Date().toISOString()
    const fromDate = new Date(from)
    const toDate = new Date(to)

    // Revenue by day
    const revenue = await db
      .select({
        date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
        totalCents: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
      })
      .from(orders)
      .where(and(
        eq(orders.status, 'paid'),
        gte(orders.createdAt, fromDate),
        lte(orders.createdAt, toDate),
      ))
      .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`)

    // New customers by day
    const newCustomers = await db
      .select({
        date: sql<string>`date_trunc('day', ${customers.createdAt})::date`,
        count: count(),
      })
      .from(customers)
      .where(and(
        gte(customers.createdAt, fromDate),
        lte(customers.createdAt, toDate),
      ))
      .groupBy(sql`date_trunc('day', ${customers.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${customers.createdAt})::date`)

    // Orders by day
    const ordersByDay = await db
      .select({
        date: sql<string>`date_trunc('day', ${orders.createdAt})::date`,
        count: count(),
      })
      .from(orders)
      .where(and(
        eq(orders.status, 'paid'),
        gte(orders.createdAt, fromDate),
        lte(orders.createdAt, toDate),
      ))
      .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`)

    // Ticket summary
    const [ticketSummary] = await db
      .select({
        open: sql<number>`count(*) filter (where ${tickets.status} = 'offen')`,
        inProgress: sql<number>`count(*) filter (where ${tickets.status} = 'in_bearbeitung')`,
        closed: sql<number>`count(*) filter (where ${tickets.status} = 'geschlossen')`,
      })
      .from(tickets)

    // Affiliate revenue in period
    const [affiliateSum] = await db
      .select({
        totalCents: sql<number>`coalesce(sum(${affiliateReferrals.amountCents}), 0)`,
      })
      .from(affiliateReferrals)
      .where(and(
        gte(affiliateReferrals.createdAt, fromDate),
        lte(affiliateReferrals.createdAt, toDate),
        eq(affiliateReferrals.status, 'approved'),
      ))

    // Sessions summary
    const [sessionSummary] = await db
      .select({
        upcoming: sql<number>`count(*) filter (where ${sessions.status} in ('pending', 'accepted') and ${sessions.scheduledAt} >= now())`,
        completed: sql<number>`count(*) filter (where ${sessions.status} = 'completed')`,
        missed: sql<number>`count(*) filter (where ${sessions.status} = 'missed')`,
      })
      .from(sessions)

    // Top plans
    const topPlans = await db
      .select({
        planCode: plans.code,
        productTitle: products.title,
        count: count(),
      })
      .from(orderItems)
      .innerJoin(plans, eq(orderItems.planId, plans.id))
      .innerJoin(products, eq(plans.productId, products.id))
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(
        eq(orders.status, 'paid'),
        gte(orders.createdAt, fromDate),
        lte(orders.createdAt, toDate),
      ))
      .groupBy(plans.code, products.title)
      .orderBy(sql`count(*) desc`)
      .limit(10)

    // Totals for KPI cards
    const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.totalCents), 0)
    const totalCustomers = newCustomers.reduce((sum, r) => sum + Number(r.count), 0)
    const totalOrders = ordersByDay.reduce((sum, r) => sum + Number(r.count), 0)

    return NextResponse.json({
      kpi: {
        totalRevenueCents: totalRevenue,
        newCustomers: totalCustomers,
        totalOrders,
        openTickets: Number(ticketSummary.open),
      },
      revenue: revenue.map((r) => ({ date: r.date, totalCents: Number(r.totalCents) })),
      customers: newCustomers.map((r) => ({ date: r.date, count: Number(r.count) })),
      orders: ordersByDay.map((r) => ({ date: r.date, count: Number(r.count) })),
      tickets: {
        open: Number(ticketSummary.open),
        inProgress: Number(ticketSummary.inProgress),
        closed: Number(ticketSummary.closed),
      },
      affiliateRevenueCents: Number(affiliateSum.totalCents),
      sessions: {
        upcoming: Number(sessionSummary.upcoming),
        completed: Number(sessionSummary.completed),
        missed: Number(sessionSummary.missed),
      },
      topPlans: topPlans.map((p) => ({ planCode: p.planCode, productTitle: p.productTitle, count: Number(p.count) })),
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
