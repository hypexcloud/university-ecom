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
import { Progress } from '@/components/ui/progress'
import {
  CalendarIcon,
  Clock,
  Play,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Video,
  Phone,
  MapPin,
  Award,
  Target,
  MessageCircle,
  Download,
  Lock
} from 'lucide-react'
import moment from 'moment'
import 'moment/locale/de'

moment.locale('de')

// Mock data for student dashboard
const mockStudentData = {
  student: {
    id: '1',
    name: 'Max Mustermann',
    course: 'AI & Machine Learning Grundlagen',
    mentor: 'Dr. Maria Schmidt',
    startDate: '2025-01-01',
    overallProgress: 75
  },
  nextSession: {
    id: '1',
    date: 'Morgen',
    time: '10:00',
    duration: 60,
    type: 'Wöchentlicher Check-in',
    mentor: 'Dr. Maria Schmidt',
    meetingType: 'zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    agenda: 'Fortschrittsbesprechung, Fragen klären, nächste Schritte planen'
  },
  upcomingSessions: [
    {
      id: '2',
      date: '31.01.2025',
      time: '14:00',
      type: 'Projektbesprechung',
      meetingType: 'zoom'
    },
    {
      id: '3',
      date: '05.02.2025',
      time: '10:00',
      type: 'Fortschrittsgespräch',
      meetingType: 'präsenz'
    }
  ],
  courseProgress: {
    currentWeek: 3,
    totalWeeks: 8,
    modules: [
      {
        id: 1,
        title: 'Grundlagen der KI',
        completed: true,
        progress: 100,
        resources: 5
      },
      {
        id: 2,
        title: 'Machine Learning Basics',
        completed: true,
        progress: 100,
        resources: 7
      },
      {
        id: 3,
        title: 'Neuronale Netze',
        completed: false,
        progress: 75,
        resources: 8
      },
      {
        id: 4,
        title: 'Deep Learning',
        completed: false,
        progress: 0,
        resources: 6,
        locked: true
      }
    ]
  },
  achievements: [
    {
      id: 1,
      title: 'Erstes Projekt abgeschlossen',
      description: 'Python Grundlagen erfolgreich gemeistert',
      earned: true,
      date: '2025-01-15'
    },
    {
      id: 2,
      title: 'Datenanalyst',
      description: '10 Datensätze erfolgreich analysiert',
      earned: true,
      date: '2025-01-20'
    },
    {
      id: 3,
      title: 'KI-Experte',
      description: 'Erstes neuronales Netz trainiert',
      earned: false
    }
  ]
}

export default function TeilnehmerDashboard() {
  const { student, nextSession, upcomingSessions, courseProgress, achievements } = mockStudentData

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'zoom': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'präsenz': return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const stats = {
    overallProgress: student.overallProgress,
    completedModules: courseProgress.modules.filter(m => m.completed).length,
    totalModules: courseProgress.modules.length,
    currentWeek: courseProgress.currentWeek,
    totalWeeks: courseProgress.totalWeeks,
    earnedAchievements: achievements.filter(a => a.earned).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hallo {student.name.split(' ')[0]}! 🎯
              </h1>
              <p className="text-gray-600 mt-2">
                {nextSession ? `Dein nächster Termin: ${nextSession.date} um ${nextSession.time}` : 'Kein anstehender Termin'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{stats.overallProgress}%</div>
              <div className="text-sm text-gray-500">Kurs-Fortschritt</div>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Dein Fortschritt - {student.course}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Gesamtfortschritt</span>
                <span className="font-medium text-gray-900">{stats.overallProgress}%</span>
              </div>
              <Progress value={stats.overallProgress} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.completedModules}/{stats.totalModules}</div>
                  <div className="text-xs text-gray-600">Module abgeschlossen</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">Woche {stats.currentWeek}</div>
                  <div className="text-xs text-gray-600">von {stats.totalWeeks} Wochen</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.earnedAchievements}</div>
                  <div className="text-xs text-gray-600">Erfolge erreicht</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Next Session & Upcoming */}
            <div className="lg:col-span-2 space-y-6">
              {/* Next Session */}
              {nextSession && (
                <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      Dein nächster Termin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{nextSession.date} um {nextSession.time} ({nextSession.duration} Min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getMeetingIcon(nextSession.meetingType)}
                          <span className="text-gray-600">{nextSession.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">mit {nextSession.mentor}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Nachricht
                        </Button>
                        {nextSession.meetingType === 'zoom' && (
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Beitreten
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {nextSession.agenda && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">Agenda:</div>
                        <div className="text-sm text-blue-800">{nextSession.agenda}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Course Modules */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Kurs-Module
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseProgress.modules.map((module) => (
                    <div 
                      key={module.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        module.completed 
                          ? 'bg-green-50 border-green-200' 
                          : module.locked 
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {module.locked ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : module.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Play className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{module.title}</div>
                            <div className="text-sm text-gray-600">{module.resources} Lernmaterialien</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{module.progress}%</div>
                          <Badge variant={
                            module.completed ? "default" : 
                            module.locked ? "secondary" : 
                            "outline"
                          }>
                            {module.completed ? "Abgeschlossen" : 
                             module.locked ? "Gesperrt" : 
                             "In Bearbeitung"}
                          </Badge>
                        </div>
                      </div>
                      
                      <Progress value={module.progress} className="mb-3" />
                      
                      <div className="flex gap-2">
                        {!module.locked && (
                          <>
                            <Button size="sm" variant="outline" className="flex-1">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {module.completed ? 'Wiederholen' : 'Weitermachen'}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Materialien
                            </Button>
                          </>
                        )}
                        {module.locked && (
                          <div className="text-sm text-gray-500 italic">
                            Schließe das vorherige Modul ab, um dieses freizuschalten
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Upcoming Sessions & Achievements */}
            <div className="space-y-6">
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
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{session.type}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            {getMeetingIcon(session.meetingType)}
                            {moment(session.date, 'DD.MM.YYYY').format('DD.MM')} um {session.time}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Deine Erfolge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`p-3 rounded-lg ${
                        achievement.earned 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Award 
                          className={`h-5 w-5 mt-0.5 ${
                            achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <div className={`font-medium ${
                            achievement.earned ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </div>
                          <div className={`text-sm ${
                            achievement.earned ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </div>
                          {achievement.earned && achievement.date && (
                            <div className="text-xs text-yellow-700 mt-1">
                              Erreicht am {moment(achievement.date).format('DD.MM.YYYY')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Deine Statistiken
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Startdatum</span>
                    <span className="font-medium">
                      {moment(student.startDate).format('DD.MM.YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tage im Kurs</span>
                    <span className="font-medium">
                      {moment().diff(moment(student.startDate), 'days')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mentor</span>
                    <Badge variant="outline">{student.mentor}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nächstes Ziel</span>
                    <span className="font-medium text-blue-600">80% Fortschritt</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
