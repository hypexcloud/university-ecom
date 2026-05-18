import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/server/db'
import {
  customers,
  entitlements,
  orders,
  sessions,
  tickets,
  adminNotes,
  plans,
  products,
} from '@/lib/server/db/schema'
import { eq, desc, isNull } from 'drizzle-orm'
import { GrantRevokeActions } from './actions'
import { NoteForm } from './note-form'

interface Props {
  params: Promise<{ uid: string }>
}

export default async function BenutzerDetailPage({ params }: Props) {
  const { uid } = await params

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.uid, uid))
    .limit(1)

  if (!customer) notFound()

  const customerEntitlements = await db
    .select({
      id: entitlements.id,
      planId: entitlements.planId,
      grantedAt: entitlements.grantedAt,
      revokedAt: entitlements.revokedAt,
      planCode: plans.code,
      productTitle: products.title,
      productSlug: products.slug,
    })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .innerJoin(products, eq(plans.productId, products.id))
    .where(eq(entitlements.customerUid, uid))
    .orderBy(desc(entitlements.grantedAt))

  const customerOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerUid, uid))
    .orderBy(desc(orders.createdAt))

  const customerSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.customerUid, uid))
    .orderBy(desc(sessions.scheduledAt))
    .limit(20)

  const customerTickets = await db
    .select()
    .from(tickets)
    .where(eq(tickets.customerUid, uid))
    .orderBy(desc(tickets.createdAt))
    .limit(20)

  const notes = await db
    .select()
    .from(adminNotes)
    .where(eq(adminNotes.customerUid, uid))
    .orderBy(desc(adminNotes.createdAt))

  // Available plans for grant action
  const allPlans = await db
    .select({ id: plans.id, code: plans.code, productTitle: products.title })
    .from(plans)
    .innerJoin(products, eq(plans.productId, products.id))

  const activeEntitlements = customerEntitlements.filter((e) => !e.revokedAt)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-muted-foreground">{customer.email}</p>
        </div>
        <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
          {customer.status}
        </Badge>
      </div>

      <Tabs defaultValue="uebersicht">
        <TabsList>
          <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
          <TabsTrigger value="produkte">Produkte ({activeEntitlements.length})</TabsTrigger>
          <TabsTrigger value="zahlungen">Zahlungen ({customerOrders.length})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({customerSessions.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({customerTickets.length})</TabsTrigger>
          <TabsTrigger value="notizen">Notizen ({notes.length})</TabsTrigger>
        </TabsList>

        {/* Übersicht Tab */}
        <TabsContent value="uebersicht">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Discord:</span>{' '}
                {customer.discordUsername || '—'}
              </div>
              <div>
                <span className="text-muted-foreground">WhatsApp:</span>{' '}
                {customer.whatsapp || '—'}
              </div>
              <div>
                <span className="text-muted-foreground">Discord ID:</span>{' '}
                {customer.discordUserId || '—'}
              </div>
              <div>
                <span className="text-muted-foreground">Registriert:</span>{' '}
                {customer.createdAt?.toLocaleDateString('de-DE')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Produkte Tab */}
        <TabsContent value="produkte">
          <Card>
            <CardHeader>
              <CardTitle>Berechtigungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerEntitlements.length === 0 ? (
                <p className="text-muted-foreground">Keine Produkte zugewiesen.</p>
              ) : (
                <div className="space-y-2">
                  {customerEntitlements.map((e) => (
                    <div key={e.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <span className="font-medium">{e.productTitle}</span>
                        {' — '}
                        <Badge variant="outline">{e.planCode}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {e.revokedAt ? (
                          <Badge variant="destructive">Widerrufen</Badge>
                        ) : (
                          <Badge variant="default">Aktiv</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <GrantRevokeActions
                customerUid={uid}
                allPlans={allPlans}
                activeEntitlementIds={activeEntitlements.map((e) => e.id)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zahlungen Tab */}
        <TabsContent value="zahlungen">
          <Card>
            <CardHeader>
              <CardTitle>Bestellungen</CardTitle>
            </CardHeader>
            <CardContent>
              {customerOrders.length === 0 ? (
                <p className="text-muted-foreground">Keine Bestellungen.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="text-sm">
                        <span className="font-medium">{(order.totalCents / 100).toFixed(2)} €</span>
                        {' — '}
                        <span className="text-muted-foreground">{order.provider}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === 'paid' ? 'default' : 'outline'}>
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {order.createdAt?.toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Termine</CardTitle>
            </CardHeader>
            <CardContent>
              {customerSessions.length === 0 ? (
                <p className="text-muted-foreground">Keine Termine.</p>
              ) : (
                <div className="space-y-2">
                  {customerSessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                      <span>{s.scheduledAt.toLocaleDateString('de-DE')} — {s.type}</span>
                      <Badge variant="outline">{s.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support-Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {customerTickets.length === 0 ? (
                <p className="text-muted-foreground">Keine Tickets.</p>
              ) : (
                <div className="space-y-2">
                  {customerTickets.map((t) => (
                    <div key={t.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                      <span>{t.subject}</span>
                      <Badge variant={t.status === 'offen' ? 'destructive' : 'outline'}>
                        {t.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notizen Tab */}
        <TabsContent value="notizen">
          <Card>
            <CardHeader>
              <CardTitle>Interne Notizen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NoteForm customerUid={uid} />
              {notes.length === 0 ? (
                <p className="text-muted-foreground">Noch keine Notizen.</p>
              ) : (
                <div className="space-y-3 mt-4">
                  {notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-3 text-sm">
                      <p>{note.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.createdAt?.toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
