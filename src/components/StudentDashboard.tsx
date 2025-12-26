'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Video,
  MessageSquare,
  ExternalLink,
  Loader2,
  ArrowRight,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Session, SESSION_STATUS } from '@/lib/booking-utils'

interface StudentDashboardProps {
  userId: string
  enrollmentId?: string
}

export default function StudentDashboard({ userId, enrollmentId }: StudentDashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  // Mock enrollment data - in production, fetch from Firebase
  const enrollment = {
    courseType: 'ai_automation',
    courseName: 'AI Automatisierung',
    planType: 'business',
    startDate: new Date(),
    progress: {
      currentWeek: 3,
      totalWeeks: 12,
      completedModules: 8,
      totalModules: 24,
      totalProgress: 33
    },
    sessionsRemaining: 2
  }

  useEffect(() => {
    loadSessions()
  }, [userId])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ userId })
      if (enrollmentId) params.append('enrollmentId', enrollmentId)
      
      const response = await fetch(`/api/get-sessions?${params}`)
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

  const upcomingSessions = sessions
    .filter(s => s.status === SESSION_STATUS.SCHEDULED && s.scheduledAt.toDate() > new Date())
    .sort((a, b) => a.scheduledAt.toDate().getTime() - b.scheduledAt.toDate().getTime())
    .slice(0, 3)

  const nextSession = upcomingSessions[0]

  const completedSessions = sessions.filter(s => s.status === SESSION_STATUS.COMPLETED).length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Willkommen zurück! 👋</h1>
        <p className="text-blue-100">
          Sie sind in Woche {enrollment.progress.currentWeek} von {enrollment.progress.totalWeeks} • 
          Weiter so! 🚀
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fortschritt</p>
                <p className="text-2xl font-bold">{enrollment.progress.totalProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold">{enrollment.sessionsRemaining}</p>
                <p className="text-xs text-gray-500">verfügbar</p>
              </div>
              <Video className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Module</p>
                <p className="text-2xl font-bold">
                  {enrollment.progress.completedModules}/{enrollment.progress.totalModules}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Woche</p>
                <p className="text-2xl font-bold">
                  {enrollment.progress.currentWeek}/{enrollment.progress.totalWeeks}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Session Card */}
          {nextSession ? (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Nächste Session
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Ihre nächste 1:1 Coaching-Session
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600">Anstehend</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {format(nextSession.scheduledAt.toDate(), 'EEEE, d. MMMM', { locale: de })}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {format(nextSession.scheduledAt.toDate(), 'HH:mm')} Uhr
                      </p>
                    </div>
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  {nextSession.topic && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Thema:</p>
                      <p className="font-medium">{nextSession.topic}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {nextSession.meetingLink && (
                      <Button asChild className="flex-1">
                        <a href={nextSession.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" />
                          Meeting beitreten
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" asChild>
                      <Link href="/student/termine">
                        Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Keine anstehenden Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sie haben noch {enrollment.sessionsRemaining} Sessions verfügbar.
                </p>
                <Button asChild>
                  <Link href="/student/book-session">
                    <Calendar className="h-4 w-4 mr-2" />
                    Session jetzt buchen
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ihr Fortschritt
              </CardTitle>
              <CardDescription>
                Kurs: {enrollment.courseName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Gesamtfortschritt</span>
                  <span className="text-sm font-bold text-blue-600">
                    {enrollment.progress.totalProgress}%
                  </span>
                </div>
                <Progress value={enrollment.progress.totalProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Aktuelle Woche</p>
                  <p className="text-2xl font-bold">
                    {enrollment.progress.currentWeek}
                  </p>
                  <p className="text-xs text-gray-500">von {enrollment.progress.totalWeeks}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Module abgeschlossen</p>
                  <p className="text-2xl font-bold">
                    {enrollment.progress.completedModules}
                  </p>
                  <p className="text-xs text-gray-500">von {enrollment.progress.totalModules}</p>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/student/course">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Weiter lernen
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          {completedSessions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Letzte Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.status === SESSION_STATUS.COMPLETED)
                    .slice(0, 3)
                    .map(session => (
                      <div key={session.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {format(session.scheduledAt.toDate(), 'd. MMM yyyy', { locale: de })}
                          </p>
                          {session.completionNotes && (
                            <p className="text-sm text-gray-600 mt-1">
                              {session.completionNotes.substring(0, 60)}
                              {session.completionNotes.length > 60 && '...'}
                            </p>
                          )}
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schnellzugriff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/student/book-session">
                  <Calendar className="h-4 w-4 mr-2" />
                  Session buchen
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/student/termine">
                  <Clock className="h-4 w-4 mr-2" />
                  Meine Termine
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/student/course">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Kursmaterial
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discord Community
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Nächste Schritte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-white rounded-full p-1.5">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Woche {enrollment.progress.currentWeek} abschließen</p>
                  <p className="text-xs text-gray-600">Noch 2 Module</p>
                </div>
              </div>
              
              {enrollment.sessionsRemaining > 0 && (
                <div className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session buchen</p>
                    <p className="text-xs text-gray-600">{enrollment.sessionsRemaining} verfügbar</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="bg-white rounded-full p-1.5">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Community beitreten</p>
                  <p className="text-xs text-gray-600">Tauschen Sie sich aus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brauchen Sie Hilfe?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Unser Support-Team ist für Sie da!
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@universityecom.com">
                  Kontakt aufnehmen
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
