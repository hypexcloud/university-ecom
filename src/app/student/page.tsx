import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { entitlements, plans, products, sessions, tickets } from '@/lib/server/db/schema'
import { eq, isNull, count, gte, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { BookOpen, Calendar, Ticket, Award, ArrowRight } from 'lucide-react'

export default async function StudentDashboard() {
  const user = await requireAuth()
  const uid = user.uid

  const activeEntitlements = await db
    .select({
      id: entitlements.id,
      planCode: plans.code,
      productTitle: products.title,
    })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .innerJoin(products, eq(plans.productId, products.id))
    .where(and(eq(entitlements.customerUid, uid), isNull(entitlements.revokedAt)))

  const upcomingSessions = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.customerUid, uid), gte(sessions.scheduledAt, new Date())))
    .orderBy(sessions.scheduledAt)
    .limit(3)

  const [openTicketCount] = await db
    .select({ value: count() })
    .from(tickets)
    .where(and(eq(tickets.customerUid, uid), eq(tickets.status, 'offen')))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Willkommen zurück, {user.customer.firstName}!</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kurse</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeEntitlements.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anstehende Termine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{upcomingSessions.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{openTicketCount.value}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Meine Kurse & Produkte</CardTitle></CardHeader>
        <CardContent>
          {activeEntitlements.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Noch keine Kurse freigeschaltet.</p>
              <Link href="/courses" className="text-primary hover:underline text-sm mt-2 inline-block">Kurse entdecken →</Link>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {activeEntitlements.map((e) => (
                <Link key={e.id} href="/student/course" className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent transition-colors">
                  <div>
                    <p className="font-medium">{e.productTitle}</p>
                    <Badge variant="outline" className="mt-1">{e.planCode}</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nächste Termine</CardTitle>
            <Link href="/student/termine" className="text-sm text-primary hover:underline">Alle ansehen</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <span>{s.scheduledAt.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })} — {s.scheduledAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</span>
                  <Badge variant={s.status === 'accepted' ? 'default' : 'outline'}>{s.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { href: '/student/course', icon: BookOpen, label: 'Kursinhalte' },
          { href: '/student/termine', icon: Calendar, label: 'Termine' },
          { href: '/student/support', icon: Ticket, label: 'Support' },
          { href: '/student/certificates', icon: Award, label: 'Zertifikate' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="border rounded-lg p-4 text-center hover:bg-accent transition-colors">
            <link.icon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
