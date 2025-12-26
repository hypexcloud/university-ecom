'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Clock, Save, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  timezone: string
  isActive: boolean
}

interface AvailabilitySettings {
  slots: AvailabilitySlot[]
  bufferMinutes: number
  sessionDuration: number
  maxSessionsPerDay: number
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Montag' },
  { value: 2, label: 'Dienstag' },
  { value: 3, label: 'Mittwoch' },
  { value: 4, label: 'Donnerstag' },
  { value: 5, label: 'Freitag' },
  { value: 6, label: 'Samstag' },
  { value: 0, label: 'Sonntag' }
]

const QUICK_TEMPLATES = [
  {
    name: 'Standard (9-17 Uhr, Mo-Fr)',
    slots: [1, 2, 3, 4, 5].map(day => ({
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'Europe/Berlin',
      isActive: true
    }))
  },
  {
    name: 'Erweitert (9-19 Uhr, Mo-Fr)',
    slots: [1, 2, 3, 4, 5].map(day => ({
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '19:00',
      timezone: 'Europe/Berlin',
      isActive: true
    }))
  },
  {
    name: 'Flexibel (10-16 Uhr, Mo-Sa)',
    slots: [1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      startTime: '10:00',
      endTime: '16:00',
      timezone: 'Europe/Berlin',
      isActive: true
    }))
  }
]

export default function AvailabilityManager({ coachId }: { coachId: string }) {
  const [settings, setSettings] = useState<AvailabilitySettings>({
    slots: DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.value,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'Europe/Berlin',
      isActive: day.value >= 1 && day.value <= 5 // Mon-Fri active by default
    })),
    bufferMinutes: 15,
    sessionDuration: 60,
    maxSessionsPerDay: 8
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAvailability()
  }, [coachId])

  const loadAvailability = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/get-availability?coachId=${coachId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.availability) {
          setSettings({
            slots: data.availability.slots,
            bufferMinutes: data.availability.bufferMinutes || 15,
            sessionDuration: data.availability.sessionDuration || 60,
            maxSessionsPerDay: data.availability.maxSessionsPerDay || 8
          })
        }
      }
    } catch (err) {
      console.error('Error loading availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/save-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId,
          ...settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save availability')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const applyTemplate = (templateIndex: number) => {
    const template = QUICK_TEMPLATES[templateIndex]
    setSettings({
      ...settings,
      slots: template.slots
    })
  }

  const updateSlot = (dayOfWeek: number, field: keyof AvailabilitySlot, value: any) => {
    setSettings({
      ...settings,
      slots: settings.slots.map(slot =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    })
  }

  const getActiveSlots = () => settings.slots.filter(s => s.isActive).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="h-7 w-7" />
            Verfügbarkeit verwalten
          </h2>
          <p className="text-gray-600 mt-1">
            Legen Sie fest, wann Kunden Sessions buchen können
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {getActiveSlots()} Tage aktiv
        </Badge>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            Verfügbarkeit erfolgreich gespeichert!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Schnellvorlagen</CardTitle>
          <CardDescription>Wählen Sie eine Vorlage als Ausgangspunkt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {QUICK_TEMPLATES.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => applyTemplate(index)}
                className="h-auto py-4 px-4 flex flex-col items-start gap-2"
              >
                <span className="font-semibold">{template.name}</span>
                <span className="text-xs text-gray-600">
                  {template.slots.length} Tage • {template.slots[0]?.startTime}-{template.slots[0]?.endTime}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wöchentlicher Zeitplan</CardTitle>
          <CardDescription>Aktivieren und konfigurieren Sie Ihre Verfügbarkeit pro Tag</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const slot = settings.slots.find(s => s.dayOfWeek === day.value)
            if (!slot) return null

            return (
              <div key={day.value} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={slot.isActive}
                      onCheckedChange={(checked) => updateSlot(day.value, 'isActive', checked)}
                    />
                    <Label className="text-base font-medium cursor-pointer">
                      {day.label}
                    </Label>
                  </div>
                  {slot.isActive && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  )}
                </div>

                {slot.isActive && (
                  <div className="ml-10 grid gap-3 md:grid-cols-2">
                    <div>
                      <Label className="text-sm">Von</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateSlot(day.value, 'startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Bis</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateSlot(day.value, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {day.value !== 0 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Session Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session-Einstellungen</CardTitle>
          <CardDescription>Konfigurieren Sie Session-Dauer und Pausen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Session-Dauer (Minuten)</Label>
              <Input
                type="number"
                min="15"
                max="180"
                step="15"
                value={settings.sessionDuration}
                onChange={(e) => setSettings({ ...settings, sessionDuration: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Standard: 60 Minuten</p>
            </div>

            <div>
              <Label>Puffer zwischen Sessions (Minuten)</Label>
              <Input
                type="number"
                min="0"
                max="60"
                step="5"
                value={settings.bufferMinutes}
                onChange={(e) => setSettings({ ...settings, bufferMinutes: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Pause nach jeder Session</p>
            </div>

            <div>
              <Label>Max. Sessions pro Tag</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.maxSessionsPerDay}
                onChange={(e) => setSettings({ ...settings, maxSessionsPerDay: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Tageslimit für Buchungen</p>
            </div>

            <div>
              <Label>Zeitzone</Label>
              <Select defaultValue="Europe/Berlin" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Berlin">Europe/Berlin (MEZ)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Ihre lokale Zeitzone</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Zusammenfassung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Aktive Tage:</span>
              <span className="font-semibold">{getActiveSlots()} Tage</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Session-Dauer:</span>
              <span className="font-semibold">{settings.sessionDuration} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Puffer-Zeit:</span>
              <span className="font-semibold">{settings.bufferMinutes} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Max. Sessions/Tag:</span>
              <span className="font-semibold">{settings.maxSessionsPerDay}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Slots pro aktiver Tag:</span>
              <span className="font-semibold">
                ~{Math.floor((8 * 60) / (settings.sessionDuration + settings.bufferMinutes))} Slots
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={loadAvailability} disabled={saving}>
          Zurücksetzen
        </Button>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Verfügbarkeit speichern
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
