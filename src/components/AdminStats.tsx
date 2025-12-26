'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { Session, SESSION_STATUS } from '@/lib/booking-utils'
import { Badge } from '@/components/ui/badge'

interface AdminStatsProps {
  coachId: string
}

export default function AdminStats({ coachId }: AdminStatsProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [coachId])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/get-sessions?coachId=${coachId}`)
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (err) {
      console.error('Error loading sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === SESSION_STATUS.SCHEDULED).length,
    completed: sessions.filter(s => s.status === SESSION_STATUS.COMPLETED).length,
    cancelled: sessions.filter(s => s.status === SESSION_STATUS.CANCELLED).length,
    noShow: sessions.filter(s => s.status === SESSION_STATUS.NO_SHOW).length,
    completionRate: sessions.length > 0 
      ? Math.round((sessions.filter(s => s.status === SESSION_STATUS.COMPLETED).length / sessions.length) * 100)
      : 0
  }

  // Calculate this week's sessions
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1))
  weekStart.setHours(0, 0, 0, 0)
  
  const thisWeek = sessions.filter(s => {
    const sessionDate = s.scheduledAt.toDate()
    return sessionDate >= weekStart && s.status === SESSION_STATUS.SCHEDULED
  }).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diese Woche</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeek}</div>
            <p className="text-xs text-muted-foreground">Geplante Sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abschlussrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} von {stats.total} Sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sessions.map(s => s.userId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Einzigartige Teilnehmer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Gesamt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Alle Zeit</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
            <CardDescription>Verteilung nach Status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Geplant</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.scheduled}</Badge>
                <span className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.scheduled / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Abgeschlossen</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.completed}</Badge>
                <span className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Storniert</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.cancelled}</Badge>
                <span className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Nicht erschienen</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{stats.noShow}</Badge>
                <span className="text-sm text-gray-500">
                  {stats.total > 0 ? Math.round((stats.noShow / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beliebte Zeiten</CardTitle>
            <CardDescription>Häufigste Buchungszeiten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPopularTimes(sessions).map((time, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{time.hour}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(time.count / sessions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{time.count}</span>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Noch keine Daten verfügbar
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getPopularTimes(sessions: Session[]): { hour: string; count: number }[] {
  const timeCounts: { [key: string]: number } = {}
  
  sessions.forEach(session => {
    const hour = session.scheduledAt.toDate().getHours()
    const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`
    timeCounts[timeSlot] = (timeCounts[timeSlot] || 0) + 1
  })

  return Object.entries(timeCounts)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
