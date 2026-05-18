// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns'
import { de } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video, Phone, MapPin, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { getAvailableTimeSlots, canBookSession, TimeSlot, MEETING_TYPES, SESSION_TYPES, type MeetingType, type SessionType } from '@/lib/booking-utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface BookingCalendarProps {
  coachId: string
  enrollmentId: string
  userId: string
  onBookingComplete?: (sessionId: string) => void
}

export default function BookingCalendar({
  coachId,
  enrollmentId,
  userId,
  onBookingComplete
}: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingEligibility, setBookingEligibility] = useState<{ canBook: boolean; reason?: string; remaining: number } | null>(null)
  const [step, setStep] = useState<'select-date' | 'select-time' | 'booking-form'>('select-date')
  
  // Booking form state
  const [meetingType, setMeetingType] = useState<MeetingType>(MEETING_TYPES.ZOOM)
  const [sessionType, setSessionType] = useState<SessionType>(SESSION_TYPES.ERSTGESPRAECH)
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check booking eligibility on mount
  useEffect(() => {
    checkEligibility()
  }, [enrollmentId])

  // Load available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const checkEligibility = async () => {
    const result = await canBookSession(enrollmentId)
    setBookingEligibility(result)
  }

  const loadAvailableSlots = async (date: Date) => {
    setLoading(true)
    try {
      const slots = await getAvailableTimeSlots(coachId, date, 60)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Error loading slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setStep('select-time')
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot)
      setStep('booking-form')
    }
  }

  const handleBooking = async () => {
    if (!selectedSlot) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coachId,
          enrollmentId,
          scheduledAt: selectedSlot.start.toISOString(),
          type: sessionType,
          meetingType,
          duration: 60,
          topic,
          notes,
          meetingLink: meetingType === MEETING_TYPES.ZOOM ? 'https://zoom.us/j/placeholder' : undefined
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Booking failed')
      }

      const result = await response.json()
      setSuccess(true)
      
      if (onBookingComplete) {
        onBookingComplete(result.sessionId)
      }

      // Reset after success
      setTimeout(() => {
        resetBooking()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetBooking = () => {
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('select-date')
    setTopic('')
    setNotes('')
    setSuccess(false)
    setError('')
    checkEligibility()
  }

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('select-date')
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('select-date')
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  // Check if booking is allowed
  if (bookingEligibility && !bookingEligibility.canBook) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Buchung nicht möglich:</strong> {bookingEligibility.reason}
        </AlertDescription>
      </Alert>
    )
  }

  // Success state
  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong className="text-green-900">Session erfolgreich gebucht!</strong>
          <p className="text-green-800 mt-1">Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.</p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with remaining sessions */}
      {bookingEligibility && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Session buchen</h3>
            <p className="text-sm text-gray-600">Wählen Sie einen verfügbaren Zeitslot</p>
          </div>
          <Badge variant="outline" className="text-base">
            {bookingEligibility.remaining === 999 
              ? '∞ Unbegrenzte Sessions'
              : `${bookingEligibility.remaining} Sessions verfügbar`
            }
          </Badge>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Date Selection */}
      {step === 'select-date' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-center">
                {format(currentWeekStart, 'MMMM yyyy', { locale: de })}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isPast = day < new Date() && !isToday(day)
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-center
                      ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
                      ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 cursor-pointer'}
                      ${isToday(day) ? 'ring-2 ring-blue-200' : ''}
                    `}
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      {format(day, 'EEE', { locale: de })}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {format(day, 'd')}
                    </div>
                    {isToday(day) && (
                      <div className="text-xs text-blue-600 mt-1">Heute</div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Time Selection */}
      {step === 'select-time' && selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep('select-date')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
              <CardTitle>
                {format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: de })}
              </CardTitle>
              <div className="w-20" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine verfügbaren Zeitslots für diesen Tag</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${slot.isAvailable 
                        ? 'border-gray-200 hover:border-blue-600 hover:bg-blue-50 cursor-pointer' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }
                      ${selectedSlot && isSameDay(selectedSlot.start, slot.start) && selectedSlot.start.getTime() === slot.start.getTime()
                        ? 'border-blue-600 bg-blue-50'
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">
                        {format(slot.start, 'HH:mm')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      60 min
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Booking Form */}
      {step === 'booking-form' && selectedSlot && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep('select-time')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
              <CardTitle>Session Details</CardTitle>
              <div className="w-20" />
            </div>
            <CardDescription>
              {format(selectedSlot.start, 'EEEE, d. MMMM yyyy • HH:mm', { locale: de })} Uhr
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Session Type */}
            <div>
              <Label>Session-Typ</Label>
              <Select value={sessionType} onValueChange={(v) => setSessionType(v as SessionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SESSION_TYPES.ERSTGESPRAECH}>Erstgespräch</SelectItem>
                  <SelectItem value={SESSION_TYPES.FOLLOWUP}>Follow-up Session</SelectItem>
                  <SelectItem value={SESSION_TYPES.SUPPORT}>Support Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Type */}
            <div>
              <Label>Meeting-Art</Label>
              <RadioGroup value={meetingType} onValueChange={(v) => setMeetingType(v as MeetingType)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={MEETING_TYPES.ZOOM} id="zoom" />
                  <Label htmlFor="zoom" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Video className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Zoom Video Call</div>
                      <div className="text-xs text-gray-500">Online Meeting</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={MEETING_TYPES.PHONE} id="phone" />
                  <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Phone className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">Telefon</div>
                      <div className="text-xs text-gray-500">Telefonanruf</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={MEETING_TYPES.IN_PERSON} id="in-person" />
                  <Label htmlFor="in-person" className="flex items-center gap-2 cursor-pointer flex-1">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium">Präsenz (vor Ort)</div>
                      <div className="text-xs text-gray-500">Persönliches Treffen</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Topic */}
            <div>
              <Label htmlFor="topic">Thema (Optional)</Label>
              <Input
                id="topic"
                placeholder="z.B. AI Automatisierung für E-Commerce"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notizen (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Gibt es etwas Spezifisches, das Sie besprechen möchten?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleBooking}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gebucht...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Session verbindlich buchen
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Sie erhalten eine Bestätigungs-E-Mail mit allen Details und dem Meeting-Link.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
