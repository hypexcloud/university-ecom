// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MoreVertical,
  Eye,
  Edit,
  Trash
} from 'lucide-react'
import { Session, SESSION_STATUS, MEETING_TYPES, getMeetingTypeLabel, getSessionTypeLabel } from '@/lib/booking-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminAppointmentViewProps {
  coachId: string
}

type ViewMode = 'list' | 'calendar'
type FilterStatus = 'all' | 'scheduled' | 'completed' | 'cancelled'

export default function AdminAppointmentView({ coachId }: AdminAppointmentViewProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    loadSessions()
  }, [coachId])

  useEffect(() => {
    applyFilters()
  }, [sessions, filterStatus, searchQuery])

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

  const applyFilters = () => {
    let filtered = [...sessions]

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s => 
        s.topic?.toLowerCase().includes(query) ||
        s.notes?.toLowerCase().includes(query)
      )
    }

    setFilteredSessions(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case SESSION_STATUS.SCHEDULED:
        return <Clock className="h-4 w-4 text-blue-600" />
      case SESSION_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case SESSION_STATUS.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-600" />
      case SESSION_STATUS.NO_SHOW:
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case MEETING_TYPES.ZOOM:
        return <Video className="h-4 w-4 text-blue-600" />
      case MEETING_TYPES.PHONE:
        return <Phone className="h-4 w-4 text-green-600" />
      case MEETING_TYPES.IN_PERSON:
        return <MapPin className="h-4 w-4 text-purple-600" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case SESSION_STATUS.COMPLETED:
        return "default"
      case SESSION_STATUS.CANCELLED:
        return "destructive"
      default:
        return "outline"
    }
  }

  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  })

  const getSessionsForDay = (day: Date) => {
    return filteredSessions.filter(session => 
      isSameDay(session.scheduledAt.toDate(), day)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Geplant</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === SESSION_STATUS.SCHEDULED).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abgeschlossen</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === SESSION_STATUS.COMPLETED).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storniert</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === SESSION_STATUS.CANCELLED).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gesamt</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Termine</CardTitle>
              <CardDescription>Verwalten Sie alle gebuchten Sessions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Kalender
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nach Thema oder Notizen suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="scheduled">Geplant</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Termine gefunden</p>
                </div>
              ) : (
                filteredSessions.map(session => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(session.status)}
                            <h3 className="font-semibold">
                              {getSessionTypeLabel(session.type)}
                            </h3>
                            <Badge variant={getStatusBadgeVariant(session.status)}>
                              {session.status === SESSION_STATUS.SCHEDULED && 'Geplant'}
                              {session.status === SESSION_STATUS.COMPLETED && 'Abgeschlossen'}
                              {session.status === SESSION_STATUS.CANCELLED && 'Storniert'}
                              {session.status === SESSION_STATUS.NO_SHOW && 'Nicht erschienen'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              {format(session.scheduledAt.toDate(), 'EEE, d. MMM yyyy', { locale: de })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(session.scheduledAt.toDate(), 'HH:mm')} Uhr ({session.duration} min)
                            </div>
                            <div className="flex items-center gap-2">
                              {getMeetingIcon(session.meetingType)}
                              {getMeetingTypeLabel(session.meetingType)}
                            </div>
                          </div>
                          {session.topic && (
                            <p className="text-sm text-gray-700 mt-2">
                              <strong>Thema:</strong> {session.topic}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Details ansehen
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Notizen hinzufügen
                            </DropdownMenuItem>
                            {session.status === SESSION_STATUS.SCHEDULED && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Als abgeschlossen markieren
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">
                  {format(currentWeekStart, 'MMMM yyyy', { locale: de })}
                </h3>
                <Button variant="outline" size="sm" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => {
                  const daySessions = getSessionsForDay(day)
                  return (
                    <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[120px]">
                      <div className="text-center mb-2">
                        <p className="text-xs text-gray-600">
                          {format(day, 'EEE', { locale: de })}
                        </p>
                        <p className="text-lg font-semibold">{format(day, 'd')}</p>
                      </div>
                      <div className="space-y-1">
                        {daySessions.map(session => (
                          <div 
                            key={session.id}
                            className="text-xs p-1 rounded bg-blue-100 border border-blue-200"
                          >
                            <p className="font-medium truncate">
                              {format(session.scheduledAt.toDate(), 'HH:mm')}
                            </p>
                            <p className="truncate text-gray-600">
                              {getSessionTypeLabel(session.type)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
