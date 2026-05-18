import { Badge } from '@/components/ui/badge'
import { Calendar, Video, Monitor, MessageCircle } from 'lucide-react'

const statusLabels: Record<string, string> = {
  pending: 'Ausstehend', accepted: 'Bestätigt', rejected: 'Abgelehnt',
  completed: 'Abgeschlossen', missed: 'Verpasst', cancelled: 'Storniert',
}

const statusVariants: Record<string, 'default' | 'destructive' | 'outline'> = {
  pending: 'outline', accepted: 'default', completed: 'default',
  rejected: 'destructive', missed: 'destructive', cancelled: 'outline',
}

export function MeetingTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'zoom': return <Video className="h-4 w-4" />
    case 'meet': return <Monitor className="h-4 w-4" />
    case 'discord': return <MessageCircle className="h-4 w-4" />
    default: return <Calendar className="h-4 w-4" />
  }
}

interface SessionCardProps {
  date: Date
  mentorName: string
  type: string
  status: string
  meetingUrl?: string | null
}

export function SessionCard({ date, mentorName, type, status, meetingUrl }: SessionCardProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <MeetingTypeIcon type={type} />
        </div>
        <div>
          <p className="font-medium text-sm">
            {date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
            {' — '}
            {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
          </p>
          <p className="text-xs text-muted-foreground">{mentorName} · {type.toUpperCase()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {meetingUrl && status === 'accepted' && (
          <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
            Beitreten
          </a>
        )}
        <Badge variant={statusVariants[status] || 'outline'}>
          {statusLabels[status] || status}
        </Badge>
      </div>
    </div>
  )
}
