// @ts-nocheck
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { Session, SESSION_STATUS } from '@/lib/booking-utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface SessionCompletionModalProps {
  session: Session | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export default function SessionCompletionModal({
  session,
  open,
  onOpenChange,
  onComplete
}: SessionCompletionModalProps) {
  const [status, setStatus] = useState<'completed' | 'no_show'>('completed')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!session?.id) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/complete-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          status,
          completionNotes: notes
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update session')
      }

      onComplete()
      onOpenChange(false)
      setNotes('')
      setStatus('completed')
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Session abschließen</DialogTitle>
          <DialogDescription>
            Markieren Sie die Session als abgeschlossen und fügen Sie Notizen hinzu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <span className="text-sm text-gray-600">Datum:</span>
              <p className="font-medium">
                {format(session.scheduledAt.toDate(), 'EEEE, d. MMMM yyyy • HH:mm', { locale: de })} Uhr
              </p>
            </div>
            {session.topic && (
              <div>
                <span className="text-sm text-gray-600">Thema:</span>
                <p className="font-medium">{session.topic}</p>
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <Label>Status *</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'completed' | 'no_show')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Abgeschlossen</span>
                  </div>
                </SelectItem>
                <SelectItem value="no_show">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-orange-600" />
                    <span>Nicht erschienen</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Completion Notes */}
          <div>
            <Label htmlFor="notes">
              Notizen {status === 'completed' && '(Optional)'}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                status === 'completed'
                  ? 'Was wurde besprochen? Welche nächsten Schritte wurden vereinbart?'
                  : 'Grund für das Nichterscheinen...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="mt-1"
            />
            {status === 'completed' && (
              <p className="text-xs text-gray-500 mt-1">
                Diese Notizen werden dem Kunden angezeigt
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Session abschließen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
