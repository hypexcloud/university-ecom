'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventInput, EventClickArg } from '@fullcalendar/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, Plus, Trash2, Save, Ban, CalendarPlus } from 'lucide-react'

const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
const DAY_MAP: Record<string, string> = { Montag: 'monday', Dienstag: 'tuesday', Mittwoch: 'wednesday', Donnerstag: 'thursday', Freitag: 'friday', Samstag: 'saturday', Sonntag: 'sunday' }
const DAY_NUM: Record<string, number> = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 }

interface RecurringSlot { dayOfWeek: string; startTime: string; endTime: string }
interface Exception { id: string; date: string; type: 'block' | 'available'; startTime: string | null; endTime: string | null; reason: string | null }

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<RecurringSlot[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showBase, setShowBase] = useState(false)

  // Exception dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDate, setDialogDate] = useState('')
  const [dialogType, setDialogType] = useState<'block' | 'available'>('block')
  const [dialogStart, setDialogStart] = useState('09:00')
  const [dialogEnd, setDialogEnd] = useState('17:00')
  const [dialogReason, setDialogReason] = useState('')
  const [dialogWholeDay, setDialogWholeDay] = useState(true)
  const [dialogSaving, setDialogSaving] = useState(false)

  const fetchData = useCallback(async () => {
    const [slotsRes, excRes] = await Promise.all([
      fetch('/api/mentor/availability'),
      fetch('/api/mentor/availability-exceptions'),
    ])
    if (slotsRes.ok) {
      const data = await slotsRes.json()
      setSlots((data.slots || []).map((s: any) => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime })))
    }
    if (excRes.ok) {
      const data = await excRes.json()
      setExceptions(data.exceptions || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Build calendar events from recurring slots (next 3 months) + exceptions
  const calendarEvents = useMemo((): EventInput[] => {
    const events: EventInput[] = []
    const now = new Date()
    const end = new Date(now)
    end.setMonth(end.getMonth() + 3)

    // Generate recurring availability as background events
    for (let d = new Date(now); d <= end; d.setDate(d.getDate() + 1)) {
      const dayNum = d.getDay()
      const dateStr = d.toISOString().slice(0, 10)

      for (const slot of slots) {
        if (DAY_NUM[slot.dayOfWeek] !== dayNum) continue

        events.push({
          id: `recurring-${dateStr}-${slot.startTime}`,
          title: `${slot.startTime}–${slot.endTime}`,
          start: `${dateStr}T${slot.startTime}`,
          end: `${dateStr}T${slot.endTime}`,
          backgroundColor: '#dbeafe',
          borderColor: '#93c5fd',
          textColor: '#1e40af',
          extendedProps: { isRecurring: true },
        })
      }
    }

    // Add exceptions as foreground events
    for (const exc of exceptions) {
      if (exc.type === 'block') {
        events.push({
          id: `exc-${exc.id}`,
          title: exc.reason || 'Blockiert',
          start: exc.startTime ? `${exc.date}T${exc.startTime}` : exc.date,
          end: exc.endTime ? `${exc.date}T${exc.endTime}` : undefined,
          allDay: !exc.startTime,
          backgroundColor: '#fecaca',
          borderColor: '#f87171',
          textColor: '#991b1b',
          extendedProps: { exceptionId: exc.id, type: 'block' },
        })
      } else {
        events.push({
          id: `exc-${exc.id}`,
          title: exc.reason || 'Extra verfügbar',
          start: exc.startTime ? `${exc.date}T${exc.startTime}` : exc.date,
          end: exc.endTime ? `${exc.date}T${exc.endTime}` : undefined,
          allDay: !exc.startTime,
          backgroundColor: '#bbf7d0',
          borderColor: '#4ade80',
          textColor: '#166534',
          extendedProps: { exceptionId: exc.id, type: 'available' },
        })
      }
    }

    return events
  }, [slots, exceptions])

  // Click on a date → open exception dialog
  const handleDateClick = (info: DateClickArg) => {
    const today = new Date().toISOString().slice(0, 10)
    if (info.dateStr < today) return

    setDialogDate(info.dateStr)
    setDialogType('block')
    setDialogWholeDay(true)
    setDialogStart('09:00')
    setDialogEnd('17:00')
    setDialogReason('')
    setDialogOpen(true)
  }

  // Click on an exception event → delete it (ignore recurring base events)
  const handleEventClick = async (info: EventClickArg) => {
    if (info.event.extendedProps?.isRecurring) return
    const exceptionId = info.event.extendedProps?.exceptionId
    if (!exceptionId) return

    if (!confirm('Ausnahme entfernen?')) return

    await fetch('/api/mentor/availability-exceptions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: exceptionId }),
    })
    setExceptions((prev) => prev.filter((e) => e.id !== exceptionId))
  }

  const handleSaveException = async () => {
    setDialogSaving(true)
    const res = await fetch('/api/mentor/availability-exceptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dialogDate,
        type: dialogType,
        startTime: dialogWholeDay ? null : dialogStart,
        endTime: dialogWholeDay ? null : dialogEnd,
        reason: dialogReason || null,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setExceptions((prev) => [...prev, data.exception])
      setDialogOpen(false)
    }
    setDialogSaving(false)
  }

  // Weekly base schedule CRUD
  const addSlot = () => setSlots([...slots, { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00' }])
  const removeSlot = (i: number) => setSlots(slots.filter((_, idx) => idx !== i))
  const updateSlot = (i: number, field: string, value: string) => {
    const updated = [...slots]
    updated[i] = { ...updated[i], [field]: value }
    setSlots(updated)
  }

  const handleSaveBase = async () => {
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

  const formattedDialogDate = dialogDate
    ? new Date(dialogDate + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Verfügbarkeit</h1>
        <Button variant="outline" size="sm" onClick={() => setShowBase(!showBase)}>
          {showBase ? 'Kalender anzeigen' : 'Basis-Zeiten bearbeiten'}
        </Button>
      </div>

      {showBase ? (
        /* Weekly base schedule editor */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Wöchentliche Basis-Zeiten</CardTitle>
              <Button variant="outline" size="sm" onClick={addSlot}><Plus className="h-4 w-4 mr-1" /> Zeitfenster</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {slots.length === 0 ? (
              <p className="text-muted-foreground text-sm">Keine Zeitfenster definiert.</p>
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

            <Button onClick={handleSaveBase} disabled={saving} className="mt-4">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saved ? 'Gespeichert!' : 'Basis-Zeiten speichern'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Calendar view */
        <>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" /> Basis-Verfügbarkeit</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-300" /> Blockiert</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-300" /> Extra verfügbar</span>
            <span className="ml-auto text-xs">Klicken Sie auf einen Tag, um eine Ausnahme hinzuzufügen. Klicken Sie auf eine Ausnahme, um sie zu entfernen.</span>
          </div>

          <div className="session-calendar-wrapper rounded-lg border bg-card p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek',
              }}
              locale="de"
              firstDay={1}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              dayMaxEvents={4}
              buttonText={{ today: 'Heute', month: 'Monat', week: 'Woche' }}
              eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
            />
          </div>
        </>
      )}

      {/* Add exception dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ausnahme hinzufügen</DialogTitle>
            <DialogDescription>{formattedDialogDate}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Typ</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDialogType('block')}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                    dialogType === 'block' ? 'border-red-400 bg-red-50 text-red-700' : 'border-border hover:border-red-300'
                  }`}
                >
                  <Ban className="h-4 w-4" /> Blockieren
                </button>
                <button
                  onClick={() => setDialogType('available')}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                    dialogType === 'available' ? 'border-green-400 bg-green-50 text-green-700' : 'border-border hover:border-green-300'
                  }`}
                >
                  <CalendarPlus className="h-4 w-4" /> Extra verfügbar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="whole-day"
                checked={dialogWholeDay}
                onChange={(e) => setDialogWholeDay(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="whole-day" className="text-sm">Ganzer Tag</Label>
            </div>

            {!dialogWholeDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Von</Label>
                  <Input type="time" value={dialogStart} onChange={(e) => setDialogStart(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Bis</Label>
                  <Input type="time" value={dialogEnd} onChange={(e) => setDialogEnd(e.target.value)} />
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs">Grund (optional)</Label>
              <Input
                value={dialogReason}
                onChange={(e) => setDialogReason(e.target.value)}
                placeholder={dialogType === 'block' ? 'z.B. Urlaub, Krank' : 'z.B. Extra-Termin'}
              />
            </div>

            <Button onClick={handleSaveException} disabled={dialogSaving} className="w-full">
              {dialogSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Ausnahme speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
