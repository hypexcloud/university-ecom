'use client'

import { useState, useEffect, useCallback } from 'react'
import { SessionCalendar, type CalendarSession } from '@/components/dashboard/session-calendar'
import { Loader2 } from 'lucide-react'

export default function AdminTerminePage() {
  const [sessions, setSessions] = useState<CalendarSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const res = await fetch('/api/admin/sessions')
    if (res.ok) {
      const data = await res.json()
      const mapped: CalendarSession[] = (data.sessions || []).map((s: any) => ({
        id: s.id,
        scheduledAt: s.scheduledAt,
        status: s.status,
        type: s.type,
        meetingUrl: s.meetingUrl || null,
        customerProposal: s.customerProposal || null,
        customerFirstName: s.customerFirstName,
        customerLastName: s.customerLastName,
        customerEmail: s.customerEmail,
      }))
      setSessions(mapped)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sessions & Termine</h1>
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sessions & Termine</h1>
      <SessionCalendar sessions={sessions} mode="admin" />
    </div>
  )
}
