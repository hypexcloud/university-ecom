// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { format, isPast, isFuture } from 'date-fns'
import { de } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  Loader2, 
  X, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { 
  Session, 
  SESSION_STATUS, 
  getMeetingTypeLabel, 
  getSessionTypeLabel,
  MEETING_TYPES 
} from '@/lib/booking-utils'

interface SessionListProps {
  userId: string
  enrollmentId?: string
}

export default function SessionList({ userId, enrollmentId }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSessions()
  }, [userId])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ userId })
      if (enrollmentId) params.append('enrollmentId', enrollmentId)
      
      const response = await fetch(`/api/get-sessions?${params}`)
      if (!response.ok) throw new Error('Failed to load sessions')
      
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError('Fehler beim Laden der Sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = (session: Session) => {
    setSelectedSession(session)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedSession?.id) return

    setCancelling(true)
    setError('')

    try {
      const response = await fetch('/api/cancel-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          enrollmentId: selectedSession.enrollmentId,
          refundSession: true
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Cancellation failed')
      }

      // Refresh sessions
      await loadSessions()
      setCancelDialogOpen(false)
      setSelectedSession(null)
    } catch (err: any) {
      setError(err.message || 'Fehler beim Stornieren')
    } finally {
      setCancelling(false)
    }
  }

  const upcomingSessions = sessions.filter(s => 
    s.status === SESSION_STATUS.SCHEDULED && 
    isFuture(s.scheduledAt.toDate())
  )

  const pastSessions = sessions.filter(s => 
    (s.status === SESSION_STATUS.COMPLETED || 
     s.status === SESSION_STATUS.CANCELLED ||
     s.status === SESSION_STATUS.NO_SHOW) ||
    (s.status === SESSION_STATUS.SCHEDULED && isPast(s.scheduledAt.toDate()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Anstehend ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Vergangen ({pastSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Keine anstehenden Sessions</p>
                <Button className="mt-4" asChild>
                  <a href="/student/book-session">Jetzt buchen</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onCancel={() => handleCancelClick(session)}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Keine vergangenen Sessions</p>
              </CardContent>
            </Card>
          ) : (
            pastSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session stornieren?</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Session wirklich stornieren? Die Session wird Ihrem Konto gutgeschrieben.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">
                    {format(selectedSession.scheduledAt.toDate(), 'EEEE, d. MMMM yyyy', { locale: de })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>{format(selectedSession.scheduledAt.toDate(), 'HH:mm')} Uhr</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSession.meetingType === MEETING_TYPES.ZOOM && <Video className="h-4 w-4 text-gray-600" />}
                  {selectedSession.meetingType === MEETING_TYPES.PHONE && <Phone className="h-4 w-4 text-gray-600" />}
                  {selectedSession.meetingType === MEETING_TYPES.IN_PERSON && <MapPin className="h-4 w-4 text-gray-600" />}
                  <span>{getMeetingTypeLabel(selectedSession.meetingType)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelling}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird storniert...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Ja, stornieren
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SessionCard({ 
  session, 
  onCancel, 
  showActions 
}: { 
  session: Session
  onCancel?: () => void
  showActions: boolean
}) {
  const sessionDate = session.scheduledAt.toDate()
  const isUpcoming = isFuture(sessionDate)
  
  const getMeetingIcon = () => {
    switch (session.meetingType) {
      case MEETING_TYPES.ZOOM:
        return <Video className="h-5 w-5 text-blue-600" />
      case MEETING_TYPES.PHONE:
        return <Phone className="h-5 w-5 text-green-600" />
      case MEETING_TYPES.IN_PERSON:
        return <MapPin className="h-5 w-5 text-purple-600" />
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = () => {
    switch (session.status) {
      case SESSION_STATUS.SCHEDULED:
        return <Badge className="bg-blue-500">Geplant</Badge>
      case SESSION_STATUS.COMPLETED:
        return <Badge className="bg-green-500">Abgeschlossen</Badge>
      case SESSION_STATUS.CANCELLED:
        return <Badge variant="destructive">Storniert</Badge>
      case SESSION_STATUS.NO_SHOW:
        return <Badge variant="outline">Nicht erschienen</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getMeetingIcon()}
            <div>
              <CardTitle className="text-lg">
                {getSessionTypeLabel(session.type)}
              </CardTitle>
              <CardDescription className="mt-1">
                {format(sessionDate, 'EEEE, d. MMMM yyyy • HH:mm', { locale: de })} Uhr
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Dauer: {session.duration} Minuten</span>
          </div>
          
          <div className="flex items-center gap-2">
            {session.meetingType === MEETING_TYPES.ZOOM && <Video className="h-4 w-4 text-gray-500" />}
            {session.meetingType === MEETING_TYPES.PHONE && <Phone className="h-4 w-4 text-gray-500" />}
            {session.meetingType === MEETING_TYPES.IN_PERSON && <MapPin className="h-4 w-4 text-gray-500" />}
            <span className="text-gray-600">{getMeetingTypeLabel(session.meetingType)}</span>
          </div>

          {session.topic && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Thema:</p>
              <p className="text-sm text-gray-700">{session.topic}</p>
            </div>
          )}

          {session.notes && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Notizen:</p>
              <p className="text-sm text-gray-700">{session.notes}</p>
            </div>
          )}
        </div>

        {showActions && session.status === SESSION_STATUS.SCHEDULED && isUpcoming && (
          <div className="flex gap-2 pt-4 border-t">
            {session.meetingLink && (
              <Button asChild className="flex-1">
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Meeting beitreten
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Stornieren
            </Button>
          </div>
        )}

        {session.status === SESSION_STATUS.COMPLETED && session.completionNotes && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">Coach Notizen:</p>
                <p className="text-sm text-green-800">{session.completionNotes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
