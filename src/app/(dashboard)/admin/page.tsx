import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, Ticket, CalendarIcon } from 'lucide-react'
import { db } from '@/lib/server/db'
import { customers, entitlements, tickets, sessions } from '@/lib/server/db/schema'
import { count, eq, isNull, and, gte } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

export default async function AdminDashboard() {
  await requireAdmin('analytics')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [customerCount] = await db
    .select({ value: count() })
    .from(customers)

  const [activeEntitlements] = await db
    .select({ value: count() })
    .from(entitlements)
    .where(isNull(entitlements.revokedAt))

  const [openTickets] = await db
    .select({ value: count() })
    .from(tickets)
    .where(eq(tickets.status, 'offen'))

  const [todaySessions] = await db
    .select({ value: count() })
    .from(sessions)
    .where(and(
      gte(sessions.scheduledAt, today),
      eq(sessions.status, 'accepted'),
    ))

  const stats = [
    { title: 'Kunden', value: customerCount.value, icon: Users },
    { title: 'Aktive Produkte', value: activeEntitlements.value, icon: ShoppingCart },
    { title: 'Offene Tickets', value: openTickets.value, icon: Ticket },
    { title: 'Termine heute', value: todaySessions.value, icon: CalendarIcon },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
