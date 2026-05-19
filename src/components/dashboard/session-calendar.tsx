'use client'

import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { useRouter } from 'next/navigation'
import type { EventInput, EventClickArg } from '@fullcalendar/core'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

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

interface SessionCalendarProps {
  sessions: CalendarSession[]
  mode: 'student' | 'admin'
  bookingHref?: string
  canBook?: boolean
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

export function SessionCalendar({ sessions, mode, bookingHref, canBook }: SessionCalendarProps) {
  const router = useRouter()
  const calendarRef = useRef<FullCalendar>(null)

  const events = toEvents(sessions, mode)

  const handleEventClick = (info: EventClickArg) => {
    const sessionId = info.event.id
    if (mode === 'student') {
      router.push(`/student/termine/${sessionId}`)
    } else {
      router.push(`/admin/termine/${sessionId}`)
    }
  }

  return (
    <div className="space-y-4">
      {canBook && bookingHref && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href={bookingHref}><Plus className="h-4 w-4 mr-2" /> Session buchen</Link>
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(statusLabels).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColors[key] }} />
            {label}
          </span>
        ))}
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
          height="auto"
          dayMaxEvents={3}
          nowIndicator
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
    </div>
  )
}
