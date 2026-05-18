'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Loader2, Save } from 'lucide-react'

export default function TermineEinstellungenPage() {
  const [timezone, setTimezone] = useState('Europe/Berlin')
  const [platform, setPlatform] = useState('zoom')
  const [maxPerWeek, setMaxPerWeek] = useState('1')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/student/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Store in billing JSONB for now
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Termin-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Zeitzone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Berlin">Europe/Berlin (MEZ)</SelectItem>
                <SelectItem value="Europe/Vienna">Europe/Vienna (MEZ)</SelectItem>
                <SelectItem value="Europe/Zurich">Europe/Zurich (MEZ)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bevorzugte Plattform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="meet">Google Meet</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Max. Termine pro Woche</Label>
            <Select value={maxPerWeek} onValueChange={setMaxPerWeek}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Termin</SelectItem>
                <SelectItem value="2">2 Termine</SelectItem>
                <SelectItem value="3">3 Termine</SelectItem>
                <SelectItem value="5">5 Termine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saved ? 'Gespeichert!' : 'Einstellungen speichern'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
