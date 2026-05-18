import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { invoices, orders } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Download, FileText } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/empty-state'

export default async function RechnungenPage() {
  const user = await requireAuth()

  const userInvoices = await db
    .select({ id: invoices.id, number: invoices.number, pdfUrl: invoices.pdfUrl, issuedAt: invoices.issuedAt, totalCents: orders.totalCents, status: orders.status })
    .from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .where(eq(orders.customerUid, user.uid))
    .orderBy(desc(invoices.issuedAt))

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Rechnungen</h2>
      <Card>
        <CardHeader><CardTitle>Meine Rechnungen</CardTitle></CardHeader>
        <CardContent>
          {userInvoices.length === 0 ? (
            <EmptyState icon={FileText} title="Keine Rechnungen" description="Du hast noch keine Rechnungen." />
          ) : (
            <div className="space-y-2">
              {userInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <div>
                    <p className="font-mono font-medium">{inv.number}</p>
                    <p className="text-xs text-muted-foreground">{inv.issuedAt.toLocaleDateString('de-DE')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{(inv.totalCents / 100).toFixed(2)} €</span>
                    <Badge variant={inv.status === 'paid' ? 'default' : 'outline'}>{inv.status === 'paid' ? 'Bezahlt' : inv.status}</Badge>
                    {inv.pdfUrl && <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><Download className="h-4 w-4" /></a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
