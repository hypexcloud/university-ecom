'use client'

import { useRef, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { useRouter } from 'next/navigation'
import type { EventInput, EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Clock, CheckCircle, Video, Phone, MessageSquare } from 'lucide-react'

export interface CalendarSession {
  id: string
  scheduledAt: string
  status: string
  type: string
  meetingUrl: string | null
  customerProposal: string | null
  mentorFirstName?: string
  mentorLastName?: string
  customerFirstName?: string
  customerLastName?: string
  customerEmail?: string
}

interface Slot {
  date: string
  time: string
  mentorUid: string
  mentorName: string
  iso: string
}

interface SessionCalendarProps {
  sessions: CalendarSession[]
  mode: 'student' | 'admin'
  canBook?: boolean
  onSessionBooked?: () => void
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  accepted: '#22c55e',
  rejected: '#ef4444',
  completed: '#3b82f6',
  missed: '#f87171',
  cancelled: '#9ca3af',
}

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend',
  accepted: 'Bestätigt',
  rejected: 'Abgelehnt',
  completed: 'Abgeschlossen',
  missed: 'Verpasst',
  cancelled: 'Storniert',
}

function toEvents(sessions: CalendarSession[], mode: 'student' | 'admin'): EventInput[] {
  return sessions.map((s) => {
    const person = mode === 'student'
      ? `${s.mentorFirstName || ''} ${s.mentorLastName || ''}`.trim()
      : `${s.customerFirstName || ''} ${s.customerLastName || ''}`.trim()

    return {
      id: s.id,
      title: person ? `${person} · ${s.type.toUpperCase()}` : s.type.toUpperCase(),
      start: s.scheduledAt,
      end: new Date(new Date(s.scheduledAt).getTime() + 60 * 60 * 1000).toISOString(),
      backgroundColor: statusColors[s.status] || '#6b7280',
      borderColor: statusColors[s.status] || '#6b7280',
      extendedProps: {
        status: s.status,
        statusLabel: statusLabels[s.status] || s.status,
        type: s.type,
        person,
      },
    }
  })
}

export function SessionCalendar({ sessions, mode, canBook, onSessionBooked }: SessionCalendarProps) {
  const router = useRouter()
  const calendarRef = useRef<FullCalendar>(null)

  // Booking dialog state
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [daySlots, setDaySlots] = useState<Slot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [meetingType, setMeetingType] = useState('zoom')
  const [booking, setBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const events = toEvents(sessions, mode)

  const handleEventClick = (info: EventClickArg) => {
    const sessionId = info.event.id
    if (mode === 'student') {
      router.push(`/student/termine/${sessionId}`)
    } else {
      router.push(`/admin/termine/${sessionId}`)
    }
  }

  const handleDateClick = useCallback(async (info: DateClickArg) => {
    if (mode !== 'student' || !canBook) return

    const clickedDate = info.dateStr // YYYY-MM-DD
    // Don't allow booking past dates
    const today = new Date().toISOString().slice(0, 10)
    if (clickedDate < today) return

    setBookingDate(clickedDate)
    setSelectedSlot(null)
    setBookingSuccess(false)
    setBookingError('')
    setMeetingType('zoom')
    setBookingOpen(true)
    setSlotsLoading(true)

    try {
      const res = await fetch('/api/student/available-slots')
      if (!res.ok) {
        const data = await res.json()
        setBookingError(data.error || 'Fehler beim Laden der Termine')
        setSlotsLoading(false)
        return
      }
      const data = await res.json()
      // Filter slots to only the clicked date
      const filtered = (data.slots as Slot[]).filter((s) => s.iso.startsWith(clickedDate))
      setDaySlots(filtered)
    } catch {
      setBookingError('Fehler beim Laden der Termine')
    } finally {
      setSlotsLoading(false)
    }
  }, [mode, canBook])

  const handleBook = async () => {
    if (!selectedSlot) return
    setBooking(true)
    setBookingError('')

    try {
      const res = await fetch('/api/student/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorUid: selectedSlot.mentorUid,
          scheduledAt: selectedSlot.iso,
          type: meetingType,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setBookingError(data.error || 'Buchung fehlgeschlagen')
        return
      }

      setBookingSuccess(true)
      setTimeout(() => {
        setBookingOpen(false)
        onSessionBooked?.()
        router.refresh()
      }, 1500)
    } catch {
      setBookingError('Buchung fehlgeschlagen')
    } finally {
      setBooking(false)
    }
  }

  const formattedDate = bookingDate
    ? new Date(bookingDate + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(statusLabels).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[key] }} />
            {label}
          </span>
        ))}
        {canBook && mode === 'student' && (
          <span className="ml-auto text-xs text-muted-foreground">Klicken Sie auf einen Tag, um eine Session zu buchen</span>
        )}
      </div>

      <div className="session-calendar-wrapper rounded-lg border bg-card p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek',
          }}
          locale="de"
          firstDay={1}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          dayMaxEvents={3}
          nowIndicator
          selectable={mode === 'student' && canBook}
          buttonText={{
            today: 'Heute',
            month: 'Monat',
            week: 'Woche',
            list: 'Liste',
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
        />
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session buchen</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-medium">Session gebucht!</p>
              <p className="text-sm text-muted-foreground">Dein Mentor wird die Anfrage bestätigen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slotsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : daySlots.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Keine verfügbaren Zeitslots an diesem Tag.
                </p>
              ) : (
                <>
                  {/* Time slots */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Verfügbare Zeiten</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {daySlots.map((slot, i) => {
                        const isSelected = selectedSlot?.iso === slot.iso && selectedSlot?.mentorUid === slot.mentorUid
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex flex-col items-center p-3 rounded-lg border text-sm transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-border hover:border-primary/50 hover:bg-accent'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5 mb-1" />
                            <span className="font-medium">{slot.time}</span>
                            <span className="text-[10px] text-muted-foreground">{slot.mentorName}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Meeting type */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Plattform</Label>
                    <Select value={meetingType} onValueChange={setMeetingType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">
                          <span className="flex items-center gap-2"><Video className="h-3.5 w-3.5" /> Zoom</span>
                        </SelectItem>
                        <SelectItem value="meet">
                          <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Google Meet</span>
                        </SelectItem>
                        <SelectItem value="discord">
                          <span className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /> Discord</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {bookingError && (
                    <p className="text-sm text-destructive">{bookingError}</p>
                  )}

                  {/* Confirm */}
                  <Button onClick={handleBook} disabled={!selectedSlot || booking} className="w-full">
                    {booking ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Wird gebucht...</>
                    ) : (
                      'Termin buchen'
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
