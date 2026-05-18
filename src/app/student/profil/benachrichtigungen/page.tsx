import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '@/lib/server/auth'
import { Bell } from 'lucide-react'

const EVENTS = [
  { label: 'Ticket-Antwort', key: 'ticket_reply' },
  { label: 'Rechnung erstellt', key: 'invoice_ready' },
  { label: 'Kursfreischaltung', key: 'entitlement_granted' },
  { label: 'Termin erstellt/geändert', key: 'appointment_created' },
  { label: 'Termin-Erinnerung', key: 'appointment_reminder' },
  { label: 'Affiliate-Provision', key: 'affiliate_commission' },
  { label: 'Community Post', key: 'community_post' },
]

export default async function NotificationPrefsPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Benachrichtigungen</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Benachrichtigungs-Einstellungen</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Ereignis</th>
                  <th className="text-center py-2 font-medium w-20">Bell</th>
                  <th className="text-center py-2 font-medium w-20">E-Mail</th>
                  <th className="text-center py-2 font-medium w-20">Discord</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS.map((e) => (
                  <tr key={e.key} className="border-b">
                    <td className="py-3">{e.label}</td>
                    <td className="text-center"><input type="checkbox" defaultChecked disabled className="accent-blue-600" /></td>
                    <td className="text-center"><input type="checkbox" defaultChecked className="accent-blue-600" /></td>
                    <td className="text-center"><input type="checkbox" defaultChecked={e.key !== 'community_post'} className="accent-blue-600" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Bell-Benachrichtigungen sind immer aktiv. Änderungen werden automatisch gespeichert.</p>
        </CardContent>
      </Card>
    </div>
  )
}
