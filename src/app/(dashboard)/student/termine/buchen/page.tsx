'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Calendar, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Slot {
  date: string
  time: string
  mentorUid: string
  mentorName: string
  iso: string
}

export default function BookSessionPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [meetingType, setMeetingType] = useState('zoom')
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const fetchSlots = useCallback(async () => {
    const res = await fetch('/api/student/available-slots')
    if (res.ok) {
      const data = await res.json()
      setSlots(data.slots)
    } else {
      const data = await res.json()
      setError(data.error || 'Fehler beim Laden')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  const handleBook = async () => {
    if (!selectedSlot) return
    setBooking(true)
    const res = await fetch('/api/student/book-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mentorUid: selectedSlot.mentorUid,
        scheduledAt: selectedSlot.iso,
        type: meetingType,
      }),
    })
    setBooking(false)
    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/student/termine'), 2000)
    } else {
      const data = await res.json()
      setError(data.error || 'Buchung fehlgeschlagen')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (error && slots.length === 0) {
    return (
      <div className="space-y-6">
        <Link href="/student/termine" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Session gebucht!</h2>
        <p className="text-muted-foreground">Dein Mentor wird deine Anfrage bestätigen.</p>
      </div>
    )
  }

  // Group slots by date
  const grouped: Record<string, Slot[]> = {}
  for (const slot of slots) {
    if (!grouped[slot.date]) grouped[slot.date] = []
    grouped[slot.date].push(slot)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/student/termine" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Termine
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Session buchen</h1>
        <p className="text-muted-foreground mt-1">Wähle einen verfügbaren Termin mit deinem Mentor.</p>
      </div>

      {/* Meeting type */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Plattform</CardTitle></CardHeader>
        <CardContent>
          <Select value={meetingType} onValueChange={setMeetingType}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="zoom">Zoom</SelectItem>
              <SelectItem value="meet">Google Meet</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Slots by day */}
      {Object.entries(grouped).map(([date, daySlots]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" /> {date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot, i) => {
                const isSelected = selectedSlot?.iso === slot.iso && selectedSlot?.mentorUid === slot.mentorUid
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <span className="font-medium">{slot.time}</span>
                    <span className="text-xs text-muted-foreground ml-2">{slot.mentorName}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {slots.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">Keine verfügbaren Termine in den nächsten 2 Wochen.</p>
          </CardContent>
        </Card>
      )}

      {/* Confirm */}
      {selectedSlot && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ausgewählt: {selectedSlot.date} um {selectedSlot.time}</p>
                <p className="text-sm text-muted-foreground">Mentor: {selectedSlot.mentorName} · {meetingType.charAt(0).toUpperCase() + meetingType.slice(1)}</p>
              </div>
              <Button onClick={handleBook} disabled={booking}>
                {booking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Termin buchen
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
