'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Trash2, Save } from 'lucide-react'

const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
const DAY_MAP: Record<string, string> = { Montag: 'monday', Dienstag: 'tuesday', Mittwoch: 'wednesday', Donnerstag: 'thursday', Freitag: 'friday', Samstag: 'saturday', Sonntag: 'sunday' }
const DAY_REVERSE: Record<string, string> = Object.fromEntries(Object.entries(DAY_MAP).map(([k, v]) => [v, k]))

interface Slot { dayOfWeek: string; startTime: string; endTime: string }

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/mentor/availability')
      .then((r) => r.json())
      .then((data) => setSlots((data.slots || []).map((s: any) => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime }))))
      .finally(() => setLoading(false))
  }, [])

  const addSlot = () => setSlots([...slots, { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00' }])
  const removeSlot = (i: number) => setSlots(slots.filter((_, idx) => idx !== i))
  const updateSlot = (i: number, field: string, value: string) => {
    const updated = [...slots]
    updated[i] = { ...updated[i], [field]: value }
    setSlots(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/mentor/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Verfügbarkeit</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Wöchentliche Zeitfenster</CardTitle>
            <Button variant="outline" size="sm" onClick={addSlot}><Plus className="h-4 w-4 mr-1" /> Zeitfenster</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {slots.length === 0 ? (
            <p className="text-muted-foreground text-sm">Keine Zeitfenster definiert. Füge deine Verfügbarkeit hinzu.</p>
          ) : (
            slots.map((slot, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Tag</Label>
                  <Select value={slot.dayOfWeek} onValueChange={(v) => updateSlot(i, 'dayOfWeek', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(DAY_MAP).map(([label, value]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Von</Label>
                  <Input type="time" value={slot.startTime} onChange={(e) => updateSlot(i, 'startTime', e.target.value)} />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Bis</Label>
                  <Input type="time" value={slot.endTime} onChange={(e) => updateSlot(i, 'endTime', e.target.value)} />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeSlot(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))
          )}

          <Button onClick={handleSave} disabled={saving} className="mt-4">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saved ? 'Gespeichert!' : 'Verfügbarkeit speichern'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
