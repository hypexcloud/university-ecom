'use client'

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  CalendarIcon,
  Users,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
  BarChart3,
  CheckCircleIcon,
  Video,
  Phone,
  MapPin,
  Award,
  MessageCircle,
  Star
} from 'lucide-react'

export default function AdminPage() {
  // Mock stats data - Enhanced with mentor metrics
  const stats = {
    totalSessions: 47,
    completedSessions: 38,
    upcomingSessions: 9,
    activeKunden: 15,
    completedThisWeek: 8,
    upcomingToday: 3,
    myRating: 4.9,
    completionRate: 96
  }

  // Mock students data - My assigned students
  const myStudents = [
    { 
      id: 1, 
      name: 'Max Mustermann', 
      course: 'AI-Kurs', 
      plan: 'Business',
      progress: 75, 
      lastSession: 'Heute',
      nextSession: '28.12.2024',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Anna Schmidt', 
      course: 'Dropshipping', 
      plan: 'Infinity',
      progress: 60, 
      lastSession: 'Vor 2 Tagen',
      nextSession: '29.12.2024',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Tom Weber', 
      course: 'AI-Kurs', 
      plan: 'Infinity',
      progress: 90, 
      lastSession: 'Heute',
      nextSession: '02.01.2025',
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Lisa Müller', 
      course: 'AI-Kurs', 
      plan: 'Business',
      progress: 45, 
      lastSession: 'Vor 1 Woche',
      nextSession: '30.12.2024',
      status: 'needs_attention'
    }
  ]

  // Today's sessions
  const todaysSessions = [
    {
      id: 1,
      time: '10:00',
      duration: 60,
      student: 'Max Mustermann',
      course: 'AI-Kurs',
      type: 'Wöchentlicher Check-in',
      meetingType: 'zoom',
      status: 'upcoming'
    },
    {
      id: 2,
      time: '14:00',
      duration: 45,
      student: 'Tom Weber',
      course: 'AI-Kurs',
      type: 'Projektbesprechung',
      meetingType: 'zoom',
      status: 'upcoming'
    },
    {
      id: 3,
      time: '16:00',
      duration: 30,
      student: 'Anna Schmidt',
      course: 'Dropshipping',
      type: 'Q&A Session',
      meetingType: 'phone',
      status: 'upcoming'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'session',
      message: 'Session mit Tom Weber abgeschlossen',
      time: 'vor 1 Stunde'
    },
    {
      id: 2,
      type: 'user',
      message: 'Neue Anmeldung: Sarah Johnson (AI-Kurs)',
      time: 'vor 3 Stunden'
    },
    {
      id: 3,
      type: 'session',
      message: 'Termin für morgen 10:00 bestätigt',
      time: 'vor 5 Stunden'
    },
    {
      id: 4,
      type: 'intake',
      message: 'Neue Intake-Bewerbung eingegangen',
      time: 'vor 6 Stunden'
    }
  ]

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'zoom': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'präsenz': return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Willkommen zurück! Du hast heute {stats.upcomingToday} Sessions geplant
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/benutzer">
              <Users className="h-4 w-4 mr-2" />
              Kunden verwalten
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/termine">
              <PlusIcon className="h-4 w-4 mr-2" />
              Session planen
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview - Enhanced with Mentor Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600">Sessions Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedThisWeek}</p>
                <p className="text-sm text-gray-600">Diese Woche</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeKunden}</p>
                <p className="text-sm text-gray-600">Aktive Kunden</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.myRating}</p>
                <p className="text-sm text-gray-600">Durchschnittsbewertung</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Sessions & Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Sessions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Heutige Sessions ({stats.upcomingToday})
                </CardTitle>
                <Button size="sm" asChild>
                  <Link href="/admin/termine">
                    Alle Termine
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysSessions.map((session) => (
                <div 
                  key={session.id}
                  className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="text-center min-w-[70px]">
                      <div className="text-xl font-bold text-blue-600">
                        {session.time}
                      </div>
                      <div className="text-xs text-gray-500">{session.duration}min</div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900">{session.student}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            {getMeetingIcon(session.meetingType)}
                            {session.type} • {session.course}
                          </div>
                        </div>
                        <Badge>Anstehend</Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">
                          {session.meetingType === 'zoom' ? (
                            <>
                              <Video className="h-4 w-4 mr-1" />
                              Zoom starten
                            </>
                          ) : (
                            <>
                              <Phone className="h-4 w-4 mr-1" />
                              Anrufen
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Nachricht
                        </Button>
                        <Button size="sm" variant="outline">
                          Profil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Students */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Meine Kunden ({myStudents.length})
                </CardTitle>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/benutzer">
                    Alle anzeigen
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {myStudents.map((student) => (
                <div 
                  key={student.id}
                  className={`p-4 rounded-lg transition-colors ${
                    student.status === 'needs_attention' 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        {student.course} • {student.plan}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{student.progress}%</div>
                      <div className="text-xs text-gray-500">Fortschritt</div>
                    </div>
                  </div>
                  
                  <Progress value={student.progress} className="mb-3 h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Letzte Session: {student.lastSession}
                    </span>
                    <span className="text-gray-600">
                      Nächste: {student.nextSession}
                    </span>
                  </div>
                  
                  {student.status === 'needs_attention' && (
                    <div className="mt-2 text-xs text-yellow-700 font-medium">
                      ⚠️ Benötigt Aufmerksamkeit
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/termine">
                    <div className="text-center">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">Session planen</div>
                      <div className="text-xs text-gray-500">Neuen Termin erstellen</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/benutzer">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="font-medium">Kunde hinzufügen</div>
                      <div className="text-xs text-gray-500">Neuen Kunden erstellen</div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/admin/intake">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="font-medium">Intake prüfen</div>
                      <div className="text-xs text-gray-500">Bewerbungen verwalten</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Aktuelle Aktivitäten</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance & System */}
        <div className="space-y-6">
          {/* My Performance */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Meine Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Bewertung</span>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                  <span className="font-bold text-yellow-600">{stats.myRating}/5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Sessions gesamt</span>
                <span className="font-semibold text-gray-900">{stats.totalSessions}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Aktive Kunden</span>
                <span className="font-semibold text-gray-900">{stats.activeKunden}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Abschlussrate</span>
                <span className="font-semibold text-green-600">{stats.completionRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Course Capacity */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Kurs-Kapazität</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">AI-Kurs (Amin)</span>
                  <span className="text-sm font-medium">10/28</span>
                </div>
                <Progress value={35.7} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">18 Plätze verfügbar</div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Dropshipping (Esat)</span>
                  <span className="text-sm font-medium">3/5</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">2 Plätze verfügbar</div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>System-Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gesamt Kunden</span>
                <span className="font-medium">{stats.activeKunden} aktiv</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Offene Intakes</span>
                <span className="font-medium">3 ausstehend</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kundenzufriedenheit</span>
                <span className="font-medium text-green-600">{stats.myRating}/5.0</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Alle Systeme funktional</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
