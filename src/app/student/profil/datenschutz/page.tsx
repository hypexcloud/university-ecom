import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/server/db'
import { consentLog } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Download, Trash2, Shield } from 'lucide-react'

export default async function DatenschutzPage() {
  const user = await requireAuth()

  const consents = await db
    .select()
    .from(consentLog)
    .where(eq(consentLog.customerUid, user.uid))
    .orderBy(desc(consentLog.createdAt))
    .limit(20)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datenschutz</h1>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> Meine Daten exportieren</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Lade alle deine persönlichen Daten als JSON-Datei herunter (DSGVO Art. 15).</p>
          <Button asChild variant="outline"><a href="/api/student/data-export"><Download className="h-4 w-4 mr-2" /> Datenexport anfordern</a></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5" /> Konto löschen</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Beantrage die Löschung deines Kontos. Rechnungen werden gem. GoBD 10 Jahre aufbewahrt, personenbezogene Daten werden anonymisiert.</p>
          <form action="/api/student/deletion-request" method="POST">
            <Button variant="destructive" type="submit"><Trash2 className="h-4 w-4 mr-2" /> Löschung beantragen</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Einwilligungsverlauf</CardTitle></CardHeader>
        <CardContent>
          {consents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Einwilligungen protokolliert.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2">Zeitpunkt</th><th className="text-left py-2">Typ</th><th className="text-left py-2">Status</th></tr></thead>
                <tbody>
                  {consents.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2">{c.createdAt.toLocaleString('de-DE')}</td>
                      <td className="py-2 capitalize">{c.consentType}</td>
                      <td className="py-2">{c.granted ? '✓ Erteilt' : '✗ Widerrufen'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
