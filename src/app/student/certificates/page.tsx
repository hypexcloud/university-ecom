import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { certificates, products } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Award, Download } from 'lucide-react'

export default async function CertificatesPage() {
  const user = await requireAuth()

  const certs = await db
    .select({
      id: certificates.id,
      productTitle: products.title,
      pdfUrl: certificates.pdfUrl,
      issuedAt: certificates.issuedAt,
    })
    .from(certificates)
    .innerJoin(products, eq(certificates.productId, products.id))
    .where(eq(certificates.customerUid, user.uid))
    .orderBy(desc(certificates.issuedAt))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Zertifikate</h1>

      <Card>
        <CardHeader><CardTitle>Ausgestellte Zertifikate</CardTitle></CardHeader>
        <CardContent>
          {certs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Noch keine Zertifikate ausgestellt.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certs.map((c) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-medium">{c.productTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Ausgestellt: {c.issuedAt.toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  {c.pdfUrl ? (
                    <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm">
                      <Download className="h-4 w-4" /> PDF
                    </a>
                  ) : (
                    <Badge variant="outline">PDF wird erstellt...</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
