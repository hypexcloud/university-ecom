'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/de'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CalendarIcon,
  Clock,
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Phone,
  MapPin,
  Eye,
  ExternalLink
} from 'lucide-react'

// Set up moment localizer for German
moment.locale('de')
const localizer = momentLocalizer(moment)

// Mock data
const mockUsers = [
  { id: '1', name: 'Dr. Maria Schmidt', role: 'mentor', email: 'maria@uniec.com' },
  { id: '2', name: 'Prof. Andreas Weber', role: 'mentor', email: 'andreas@uniec.com' },
  { id: '3', name: 'Max Mustermann', role: 'teilnehmer', email: 'max@gmail.com' },
  { id: '4', name: 'Anna Schmidt', role: 'teilnehmer', email: 'anna@gmail.com' },
  { id: '5', name: 'Tom Weber', role: 'teilnehmer', email: 'tom@gmail.com' }
]

const mockSessions = [
  {
    id: '1',
    title: 'Erstberatung AI-Kurs',
    start: new Date(2025, 0, 27, 10, 0),
    end: new Date(2025, 0, 27, 11, 0),
    mentorId: '1',
    teilnehmerId: '3',
    sessionType: 'erstberatung',
    status: 'geplant',
    meetingType: 'zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    description: 'Erstes Gespräch zur Einführung in den AI-Kurs',
    notes: ''
  },
  {
    id: '2',
    title: 'Wöchentlicher Check-in',
    start: new Date(2025, 0, 27, 14, 0),
    end: new Date(2025, 0, 27, 14, 30),
    mentorId: '2',
    teilnehmerId: '4',
    sessionType: 'check-in',
    status: 'abgeschlossen',
    meetingType: 'phone',
    phone: '+49 30 12345678',
    description: 'Wöchentliche Fortschrittsbesprechung Dropshipping',
    notes: 'Gute Fortschritte bei der Shop-Einrichtung'
  },
  {
    id: '3',
    title: 'Projektbesprechung',
    start: new Date(2025, 0, 28, 16, 0),
    end: new Date(2025, 0, 28, 17, 0),
    mentorId: '1',
    teilnehmerId: '5',
    sessionType: 'projekt',
    status: 'geplant',
    meetingType: 'zoom',
    meetingLink: 'https://zoom.us/j/987654321',
    description: 'Besprechung des aktuellen AI-Projekts',
    notes: ''
  }
]

type SessionStatus = 'geplant' | 'abgeschlossen' | 'abgesagt'
type SessionType = 'erstberatung' | 'check-in' | 'projekt' | 'fortschritt' | 'zusatz'
type MeetingType = 'zoom' | 'phone' | 'präsenz'

interface Session {
  id: string
  title: string
  start: Date
  end: Date
  mentorId: string
  teilnehmerId: string
  sessionType: SessionType
  status: SessionStatus
  meetingType: MeetingType
  meetingLink?: string
  phone?: string
  location?: string
  description: string
  notes: string
}

export default function TermineVerwaltung() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [users] = useState(mockUsers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>('week')

  const [newSession, setNewSession] = useState({
    title: '',
    start: '',
    end: '',
    date: '',
    mentorId: '',
    teilnehmerId: '',
    sessionType: 'check-in' as SessionType,
    meetingType: 'zoom' as MeetingType,
    meetingLink: '',
    phone: '',
    location: '',
    description: ''
  })

  const sessionStats = {
    total: sessions.length,
    geplant: sessions.filter(s => s.status === 'geplant').length,
    abgeschlossen: sessions.filter(s => s.status === 'abgeschlossen').length,
    abgesagt: sessions.filter(s => s.status === 'abgesagt').length,
    heute: sessions.filter(s => moment(s.start).isSame(moment(), 'day')).length
  }

  const filteredSessions = sessions.filter(session => 
    statusFilter === 'all' || session.status === statusFilter
  ).sort((a, b) => a.start.getTime() - b.start.getTime())

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unbekannt'
  }

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'geplant': return 'bg-blue-100 text-blue-800'
      case 'abgeschlossen': return 'bg-green-100 text-green-800'
      case 'abgesagt': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case 'erstberatung': return <Users className="h-4 w-4" />
      case 'check-in': return <CheckCircle className="h-4 w-4" />
      case 'projekt': return <AlertCircle className="h-4 w-4" />
      case 'fortschritt': return <Clock className="h-4 w-4" />
      case 'zusatz': return <Plus className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getMeetingTypeIcon = (type: MeetingType) => {
    switch (type) {
      case 'zoom': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'präsenz': return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const handleAddSession = () => {
    if (!newSession.title || !newSession.date || !newSession.start || !newSession.end || !newSession.mentorId || !newSession.teilnehmerId) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.')
      return
    }

    const startDateTime = new Date(`${newSession.date}T${newSession.start}`)
    const endDateTime = new Date(`${newSession.date}T${newSession.end}`)

    const session: Session = {
      id: Date.now().toString(),
      title: newSession.title,
      start: startDateTime,
      end: endDateTime,
      mentorId: newSession.mentorId,
      teilnehmerId: newSession.teilnehmerId,
      sessionType: newSession.sessionType,
      status: 'geplant',
      meetingType: newSession.meetingType,
      meetingLink: newSession.meetingLink,
      phone: newSession.phone,
      location: newSession.location,
      description: newSession.description,
      notes: ''
    }

    setSessions([...sessions, session])
    setIsAddDialogOpen(false)
    setNewSession({
      title: '',
      start: '',
      end: '',
      date: '',
      mentorId: '',
      teilnehmerId: '',
      sessionType: 'check-in',
      meetingType: 'zoom',
      meetingLink: '',
      phone: '',
      location: '',
      description: ''
    })
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
  }

  const handleSaveEdit = () => {
    if (!editingSession) return
    setSessions(sessions.map(s => s.id === editingSession.id ? editingSession : s))
    setEditingSession(null)
  }

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Termin löschen möchten?')) {
      setSessions(sessions.filter(s => s.id !== sessionId))
    }
  }

  const handleStatusChange = (sessionId: string, newStatus: SessionStatus) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? { ...session, status: newStatus } : session
    ))
  }

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad'
    
    switch (event.status) {
      case 'geplant': backgroundColor = '#3b82f6'; break
      case 'abgeschlossen': backgroundColor = '#10b981'; break
      case 'abgesagt': backgroundColor = '#ef4444'; break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const calendarMessages = {
    allDay: 'Ganztägig',
    previous: 'Zurück',
    next: 'Weiter',
    today: 'Heute',
    month: 'Monat',
    week: 'Woche',
    day: 'Tag',
    agenda: 'Agenda',
    date: 'Datum',
    time: 'Zeit',
    event: 'Termin',
    noEventsInRange: 'Keine Termine in diesem Bereich',
    showMore: (total: number) => `+ ${total} weitere`
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { key: 'total', label: 'Gesamt', value: sessionStats.total, icon: CalendarIcon, color: 'blue' },
          { key: 'geplant', label: 'Geplant', value: sessionStats.geplant, icon: Clock, color: 'blue' },
          { key: 'abgeschlossen', label: 'Abgeschlossen', value: sessionStats.abgeschlossen, icon: CheckCircle, color: 'green' },
          { key: 'abgesagt', label: 'Abgesagt', value: sessionStats.abgesagt, icon: XCircle, color: 'red' },
          { key: 'heute', label: 'Heute', value: sessionStats.heute, icon: AlertCircle, color: 'yellow' }
        ].map(({ key, label, value, icon: Icon, color }) => (
          <Card key={key} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${color}-100 rounded-lg`}>
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-600">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar and List */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="list">Liste</TabsTrigger>
          </TabsList>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Termin planen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neuen Termin planen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Mentor</Label>
                    <Select value={newSession.mentorId} onValueChange={(value) => setNewSession({ ...newSession, mentorId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mentor auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(u => u.role === 'mentor').map(mentor => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Teilnehmer</Label>
                    <Select value={newSession.teilnehmerId} onValueChange={(value) => setNewSession({ ...newSession, teilnehmerId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Teilnehmer auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(u => u.role === 'teilnehmer').map(teilnehmer => (
                          <SelectItem key={teilnehmer.id} value={teilnehmer.id}>
                            {teilnehmer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Titel</Label>
                  <Input
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    placeholder="z.B. Wöchentlicher Check-in"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Datum</Label>
                    <Input
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Start</Label>
                    <Input
                      type="time"
                      value={newSession.start}
                      onChange={(e) => setNewSession({ ...newSession, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Ende</Label>
                    <Input
                      type="time"
                      value={newSession.end}
                      onChange={(e) => setNewSession({ ...newSession, end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Termin-Typ</Label>
                    <Select value={newSession.sessionType} onValueChange={(value: SessionType) => setNewSession({ ...newSession, sessionType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erstberatung">Erstberatung</SelectItem>
                        <SelectItem value="check-in">Check-in</SelectItem>
                        <SelectItem value="projekt">Projektbesprechung</SelectItem>
                        <SelectItem value="fortschritt">Fortschrittsgespräch</SelectItem>
                        <SelectItem value="zusatz">Zusatztermin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Meeting-Typ</Label>
                    <Select value={newSession.meetingType} onValueChange={(value: MeetingType) => setNewSession({ ...newSession, meetingType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom Meeting</SelectItem>
                        <SelectItem value="phone">Telefon</SelectItem>
                        <SelectItem value="präsenz">Vor Ort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newSession.meetingType === 'zoom' && (
                  <div>
                    <Label>Zoom Link</Label>
                    <Input
                      value={newSession.meetingLink}
                      onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                )}

                {newSession.meetingType === 'phone' && (
                  <div>
                    <Label>Telefonnummer</Label>
                    <Input
                      value={newSession.phone}
                      onChange={(e) => setNewSession({ ...newSession, phone: e.target.value })}
                      placeholder="+49 30 12345678"
                    />
                  </div>
                )}

                {newSession.meetingType === 'präsenz' && (
                  <div>
                    <Label>Ort</Label>
                    <Input
                      value={newSession.location}
                      onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                      placeholder="Büro Berlin, Raum 204"
                    />
                  </div>
                )}

                <div>
                  <Label>Beschreibung</Label>
                  <Textarea
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    placeholder="Agenda und Ziele des Termins..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddSession} className="flex-1">
                    Termin erstellen
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Abbrechen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-6">
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={sessions}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => setSelectedSession(event as Session)}
                  views={['month', 'week', 'day', 'agenda']}
                  view={currentView}
                  onView={(view) => setCurrentView(view)}
                  step={30}
                  showMultiDayTimes
                  popup
                  messages={calendarMessages}
                  date={currentDate}
                  onNavigate={(date) => setCurrentDate(date)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rest of the component remains the same... */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alle Termine ({filteredSessions.length})</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="geplant">Geplant</SelectItem>
                    <SelectItem value="abgeschlossen">Abgeschlossen</SelectItem>
                    <SelectItem value="abgesagt">Abgesagt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Termin</TableHead>
                    <TableHead>Teilnehmer</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm text-gray-500">{session.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getUserName(session.teilnehmerId)}</TableCell>
                      <TableCell>{getUserName(session.mentorId)}</TableCell>
                      <TableCell>
                        <div>
                          <div>{moment(session.start).format('DD.MM.YYYY')}</div>
                          <div className="text-sm text-gray-500">
                            {moment(session.start).format('HH:mm')} - {moment(session.end).format('HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedSession(session)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditSession(session)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteSession(session.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedSession.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Mentor</Label>
                  <p>{getUserName(selectedSession.mentorId)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Teilnehmer</Label>
                  <p>{getUserName(selectedSession.teilnehmerId)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Datum & Zeit</Label>
                  <p>
                    {moment(selectedSession.start).format('DD.MM.YYYY, HH:mm')} - {moment(selectedSession.end).format('HH:mm')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedSession.status)}>
                    {selectedSession.status}
                  </Badge>
                </div>
              </div>

              {selectedSession.description && (
                <div>
                  <Label className="text-sm text-gray-500">Beschreibung</Label>
                  <p>{selectedSession.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => handleEditSession(selectedSession)} variant="outline" className="flex-1">
                  Bearbeiten
                </Button>
                <Button onClick={() => setSelectedSession(null)} className="flex-1">
                  Schließen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Session Dialog */}
      {editingSession && (
        <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Termin bearbeiten</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Titel</Label>
                <Input
                  value={editingSession.title}
                  onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Datum</Label>
                  <Input
                    type="date"
                    value={moment(editingSession.start).format('YYYY-MM-DD')}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value)
                      const currentTime = moment(editingSession.start)
                      newDate.setHours(currentTime.hour(), currentTime.minute())
                      setEditingSession({ ...editingSession, start: newDate })
                    }}
                  />
                </div>
                <div>
                  <Label>Zeit</Label>
                  <Input
                    type="time"
                    value={moment(editingSession.start).format('HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':')
                      const newStart = new Date(editingSession.start)
                      newStart.setHours(parseInt(hours), parseInt(minutes))
                      setEditingSession({ ...editingSession, start: newStart })
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={editingSession.description}
                  onChange={(e) => setEditingSession({ ...editingSession, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setEditingSession(null)} className="flex-1">
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
