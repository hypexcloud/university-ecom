'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  Star,
  TrendingUp,
  MessageCircle,
  Video,
  Phone,
  MapPin
} from 'lucide-react'
import moment from 'moment'
import 'moment/locale/de'

moment.locale('de')

// Mock data for mentor dashboard
const mockMentorData = {
  mentor: {
    id: '1',
    name: 'Dr. Maria Schmidt',
    rating: 4.8,
    totalSessions: 24,
    completedSessions: 18,
    specialization: 'AI & Machine Learning'
  },
  todaySessions: [
    {
      id: '1',
      time: '10:00',
      duration: 60,
      student: 'Max Mustermann',
      type: 'Erstberatung',
      meetingType: 'zoom',
      status: 'upcoming'
    },
    {
      id: '2', 
      time: '14:00',
      duration: 30,
      student: 'Anna Schmidt',
      type: 'Check-in',
      meetingType: 'phone',
      status: 'completed'
    },
    {
      id: '3',
      time: '16:00', 
      duration: 45,
      student: 'Tom Weber',
      type: 'Projektbesprechung',
      meetingType: 'zoom',
      status: 'upcoming'
    }
  ],
  upcomingSessions: [
    {
      id: '4',
      date: 'Mo, 27.01',
      time: '09:00',
      student: 'Lisa Müller',
      type: 'Fortschrittsgespräch',
      meetingType: 'präsenz'
    },
    {
      id: '5',
      date: 'Mi, 29.01',
      time: '15:00', 
      student: 'Max Mustermann',
      type: 'Follow-up',
      meetingType: 'zoom'
    },
    {
      id: '6',
      date: 'Fr, 31.01',
      time: '10:00',
      student: 'Sarah Weber',
      type: 'Erstberatung',
      meetingType: 'zoom'
    }
  ],
  students: [
    {
      id: '1',
      name: 'Max Mustermann',
      progress: 75,
      nextSession: 'Heute 16:00',
      course: 'AI-Grundlagen'
    },
    {
      id: '2',
      name: 'Anna Schmidt', 
      progress: 90,
      nextSession: 'Mo 27.01',
      course: 'Machine Learning'
    },
    {
      id: '3',
      name: 'Tom Weber',
      progress: 60,
      nextSession: 'Mi 29.01', 
      course: 'Deep Learning'
    }
  ]
}

export default function MentorDashboardPage() {
  const [selectedDate] = useState(new Date())
  const { mentor, todaySessions, upcomingSessions, students } = mockMentorData

  const stats = {
    todayTotal: todaySessions.length,
    todayCompleted: todaySessions.filter(s => s.status === 'completed').length,
    todayUpcoming: todaySessions.filter(s => s.status === 'upcoming').length,
    thisWeekTotal: 7,
    monthlyRating: mentor.rating
  }

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'zoom': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'präsenz': return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hallo, {mentor.name.split(' ')[1]}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {moment().format('dddd, DD. MMMM YYYY')} • {stats.todayTotal} Termine heute
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">⭐ {mentor.rating}/5</div>
          <div className="text-sm text-gray-500">{mentor.totalSessions} Sessions gesamt</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.todayTotal}</p>
                <p className="text-sm text-gray-600">Termine heute</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.todayCompleted}</p>
                <p className="text-sm text-gray-600">Abgeschlossen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.todayUpcoming}</p>
                <p className="text-sm text-gray-600">Anstehend</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeekTotal}</p>
                <p className="text-sm text-gray-600">Diese Woche</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Sessions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Heutige Termine ({stats.todayTotal})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{session.time}</div>
                      <div className="text-xs text-gray-500">{session.duration}min</div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{session.student}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          {getMeetingIcon(session.meetingType)}
                          {session.type}
                        </div>
                      </div>
                      <Badge className={getSessionStatusColor(session.status)}>
                        {session.status === 'completed' ? 'Abgeschlossen' : 'Anstehend'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {session.status === 'upcoming' && (
                      <>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Nachricht
                        </Button>
                        <Button size="sm">
                          {getMeetingIcon(session.meetingType)}
                          <span className="ml-1">Beitreten</span>
                        </Button>
                      </>
                    )}
                    {session.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        Notizen hinzufügen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Kommende Termine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-medium text-blue-900">{session.time}</div>
                      <div className="text-xs text-blue-600">{session.date}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{session.student}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        {getMeetingIcon(session.meetingType)}
                        {session.type}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Student Progress & Quick Stats */}
        <div className="space-y-6">
          {/* Your Students */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Deine Studenten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.progress}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{student.course}</span>
                    <span className="text-green-600">Nächster: {student.nextSession}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Deine Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bewertung</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{mentor.rating}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sessions gesamt</span>
                <span className="font-medium">{mentor.totalSessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Abschlussrate</span>
                <span className="font-medium text-green-600">
                  {Math.round((mentor.completedSessions / mentor.totalSessions) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Spezialisierung</span>
                <Badge variant="outline">{mentor.specialization}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Student kontaktieren
              </Button>
              <Button className="w-full" variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Verfügbarkeit ändern
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Fortschritt eintragen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
