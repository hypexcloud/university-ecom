import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/server/db'
import { certificates, products } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Award, Download } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/empty-state'

export default async function ZertifikatePage() {
  const user = await requireAuth()

  const certs = await db
    .select({ id: certificates.id, productTitle: products.title, pdfUrl: certificates.pdfUrl, issuedAt: certificates.issuedAt })
    .from(certificates)
    .innerJoin(products, eq(certificates.productId, products.id))
    .where(eq(certificates.customerUid, user.uid))
    .orderBy(desc(certificates.issuedAt))

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Zertifikate</h2>
      <Card>
        <CardHeader><CardTitle>Ausgestellte Zertifikate</CardTitle></CardHeader>
        <CardContent>
          {certs.length === 0 ? (
            <EmptyState icon={Award} title="Keine Zertifikate" description="Noch keine Zertifikate ausgestellt." />
          ) : (
            <div className="space-y-2">
              {certs.map((c) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium">{c.productTitle}</p>
                    <p className="text-xs text-muted-foreground">Ausgestellt: {c.issuedAt.toLocaleDateString('de-DE')}</p>
                  </div>
                  {c.pdfUrl ? <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm"><Download className="h-4 w-4" /> PDF</a> : <span className="text-xs text-muted-foreground">PDF wird erstellt...</span>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
