'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Loader2 } from 'lucide-react'

const EVENTS = [
  { label: 'Ticket-Antwort', key: 'ticket_reply' },
  { label: 'Rechnung erstellt', key: 'invoice_ready' },
  { label: 'Kursfreischaltung', key: 'entitlement_granted' },
  { label: 'Termin erstellt/geändert', key: 'appointment_created' },
  { label: 'Termin-Erinnerung', key: 'appointment_reminder' },
  { label: 'Affiliate-Provision', key: 'affiliate_commission' },
  { label: 'Community Post', key: 'community_post' },
]

type Prefs = Record<string, { bell: boolean; email: boolean; discord: boolean }>

const defaults: Prefs = Object.fromEntries(
  EVENTS.map((e) => [e.key, { bell: true, email: true, discord: e.key !== 'community_post' }]),
)

export default function NotificationPrefsPage() {
  const [prefs, setPrefs] = useState<Prefs>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/student/notification-prefs')
      .then((r) => r.json())
      .then((data) => {
        if (data.prefs && Object.keys(data.prefs).length > 0) setPrefs({ ...defaults, ...data.prefs })
      })
      .finally(() => setLoading(false))
  }, [])

  const toggle = (eventKey: string, channel: 'email' | 'discord') => {
    const updated = {
      ...prefs,
      [eventKey]: { ...prefs[eventKey], [channel]: !prefs[eventKey][channel] },
    }
    setPrefs(updated)

    // Auto-save
    setSaving(true)
    fetch('/api/student/notification-prefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).finally(() => setSaving(false))
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Benachrichtigungs-Einstellungen</CardTitle>
            {saving && <span className="text-xs text-muted-foreground">Speichern...</span>}
          </div>
        </CardHeader>
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
                    <td className="text-center"><input type="checkbox" checked disabled className="accent-blue-600" /></td>
                    <td className="text-center">
                      <input type="checkbox" checked={prefs[e.key]?.email ?? true} onChange={() => toggle(e.key, 'email')} className="accent-blue-600 cursor-pointer" />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={prefs[e.key]?.discord ?? false} onChange={() => toggle(e.key, 'discord')} className="accent-blue-600 cursor-pointer" />
                    </td>
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
