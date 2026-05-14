'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Zap,
  Lock,
  PlayCircle,
  FileText,
  Award,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Session, SESSION_STATUS } from '@/lib/booking-utils'

interface StudentDashboardProps {
  userId: string
  enrollmentId?: string
}

// Plan Types
type PlanType = 'fast' | 'business' | 'infinity'

interface EnrollmentData {
  courseType: 'ai_automation' | 'eu_dropshipping'
  courseName: string
  planType: PlanType
  planDisplayName: string
  startDate: Date
  progress: {
    currentWeek: number
    totalWeeks: number
    completedModules: number
    totalModules: number
    totalProgress: number
  }
  // Mentoring specific (Business & Infinity)
  sessionsRemaining?: number
  totalSessions?: number
  // Infinity specific
  hasCustomWebsite?: boolean
  hasProductResearch?: boolean
}

interface CourseModule {
  id: string
  week: number
  title: string
  description: string
  progress: number
  isCompleted: boolean
  isLocked: boolean
  resources: {
    id: string
    title: string
    type: 'video' | 'pdf' | 'quiz' | 'template'
    duration?: string
    isCompleted: boolean
  }[]
}

export default function StudentDashboardPlanBased({ userId, enrollmentId }: StudentDashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [modules, setModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)

  // Mock enrollment data - in production, fetch from Firebase based on enrollmentId
  const enrollment: EnrollmentData = {
    courseType: 'ai_automation',
    courseName: 'AI Automatisierung',
    planType: 'infinity', // Change this to test different plans: 'fast', 'business', 'infinity'
    planDisplayName: 'Infinity Plan',
    startDate: new Date(),
    progress: {
      currentWeek: 3,
      totalWeeks: 12,
      completedModules: 8,
      totalModules: 24,
      totalProgress: 33
    },
    // For business and infinity
    sessionsRemaining: 2,
    totalSessions: 6,
    // For infinity only
    hasCustomWebsite: false,
    hasProductResearch: true
  }

  // Mock course modules
  const mockModules: CourseModule[] = [
    {
      id: 'module-1',
      week: 1,
      title: 'AI Grundlagen',
      description: 'Einführung in die Grundlagen der KI',
      progress: 100,
      isCompleted: true,
      isLocked: false,
      resources: [
        { id: 'r1', title: 'Was ist KI?', type: 'video', duration: '15 Min', isCompleted: true },
        { id: 'r2', title: 'AI Tools Übersicht', type: 'video', duration: '20 Min', isCompleted: true },
        { id: 'r3', title: 'Quiz: AI Basics', type: 'quiz', isCompleted: true }
      ]
    },
    {
      id: 'module-2',
      week: 2,
      title: 'Prompt Engineering',
      description: 'Effektive Prompts erstellen',
      progress: 60,
      isCompleted: false,
      isLocked: false,
      resources: [
        { id: 'r4', title: 'Prompt Strukturen', type: 'video', duration: '25 Min', isCompleted: true },
        { id: 'r5', title: 'Advanced Techniken', type: 'video', duration: '30 Min', isCompleted: false },
        { id: 'r6', title: 'Template: Prompt Library', type: 'template', isCompleted: false }
      ]
    },
    {
      id: 'module-3',
      week: 3,
      title: 'Automationen & Workflows',
      description: 'Automatisierte Workflows mit KI',
      progress: 0,
      isCompleted: false,
      isLocked: false,
      resources: [
        { id: 'r7', title: 'Workflow Design', type: 'video', duration: '20 Min', isCompleted: false },
        { id: 'r8', title: 'Tool Integration', type: 'video', duration: '35 Min', isCompleted: false }
      ]
    },
    {
      id: 'module-4',
      week: 4,
      title: 'Marketing & Content',
      description: 'KI-gestütztes Marketing',
      progress: 0,
      isCompleted: false,
      isLocked: true,
      resources: []
    }
  ]

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load sessions (for Business & Infinity plans)
      if (enrollment.planType === 'business' || enrollment.planType === 'infinity') {
        const params = new URLSearchParams({ userId })
        if (enrollmentId) params.append('enrollmentId', enrollmentId)
        
        const response = await fetch(`/api/get-sessions?${params}`)
        if (response.ok) {
          const data = await response.json()
          setSessions(data.sessions || [])
        }
      }

      // Load course modules
      setModules(mockModules)
    } catch (err) {
      console.error('Error loading data:', err)
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

  // Check if user has mentoring access
  const hasMentoringAccess = enrollment.planType === 'business' || enrollment.planType === 'infinity'
  const hasInfinityFeatures = enrollment.planType === 'infinity'

  // Get plan badge color
  const getPlanBadgeColor = () => {
    switch (enrollment.planType) {
      case 'fast': return 'bg-gray-600'
      case 'business': return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      case 'infinity': return 'bg-gradient-to-r from-purple-600 to-blue-600'
      default: return 'bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header with Plan Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Willkommen zurück! 👋</h1>
            <Badge className={`${getPlanBadgeColor()} text-white border-0 px-4 py-1`}>
              {enrollment.planDisplayName}
            </Badge>
          </div>
          <p className="text-blue-100">
            {enrollment.courseName} • Woche {enrollment.progress.currentWeek} von {enrollment.progress.totalWeeks}
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mb-24" />
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

        {hasMentoringAccess && (
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
        )}

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

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="courses">Kurse</TabsTrigger>
          {hasMentoringAccess && (
            <TabsTrigger value="mentoring">
              Mentoring
              {enrollment.sessionsRemaining && enrollment.sessionsRemaining > 0 && (
                <Badge className="ml-2 bg-green-500">{enrollment.sessionsRemaining}</Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Next Session Card (Business & Infinity) */}
              {hasMentoringAccess && nextSession && (
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
              )}

              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Ihr Fortschritt
                  </CardTitle>
                  <CardDescription>
                    {enrollment.courseName}
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

              {/* Infinity Plan Extras */}
              {hasInfinityFeatures && (
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Infinity Premium Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${enrollment.hasProductResearch ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {enrollment.hasProductResearch ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Product Research</p>
                          <p className="text-sm text-gray-600">
                            {enrollment.hasProductResearch ? 'Abgeschlossen' : 'In Bearbeitung'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${enrollment.hasCustomWebsite ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {enrollment.hasCustomWebsite ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Custom Website</p>
                          <p className="text-sm text-gray-600">
                            {enrollment.hasCustomWebsite ? 'Fertiggestellt' : 'Geplant'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Premium Support kontaktieren
                    </Button>
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
                    <Link href="/student/course">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Kursmaterial
                    </Link>
                  </Button>
                  
                  {hasMentoringAccess && (
                    <>
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
                    </>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discord Community
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ihr {enrollment.planDisplayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Alle Video-Inhalte</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Kursmaterialien</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Community-Zugang</span>
                    </div>
                    
                    {hasMentoringAccess && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>1:1 Mentoring-Sessions</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Direkte Unterstützung</span>
                        </div>
                      </>
                    )}
                    
                    {hasInfinityFeatures && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Premium Coaching</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Custom Website</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Product Research</span>
                        </div>
                      </>
                    )}
                  </div>

                  {enrollment.planType === 'fast' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        Upgrade für 1:1 Mentoring?
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Jetzt upgraden
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kursmodule</CardTitle>
              <CardDescription>
                Lernen Sie in Ihrem eigenen Tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div 
                    key={module.id}
                    className={`border rounded-lg p-4 ${module.isLocked ? 'bg-gray-50 opacity-60' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Woche {module.week}
                          </Badge>
                          {module.isCompleted && (
                            <Badge className="bg-green-600 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Abgeschlossen
                            </Badge>
                          )}
                          {module.isLocked && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Gesperrt
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-blue-600">{module.progress}%</p>
                      </div>
                    </div>

                    <Progress value={module.progress} className="h-2 mb-3" />

                    {!module.isLocked && module.resources.length > 0 && (
                      <div className="space-y-2">
                        {module.resources.slice(0, 3).map((resource) => (
                          <div 
                            key={resource.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              {resource.type === 'video' && <PlayCircle className="h-4 w-4 text-blue-600" />}
                              {resource.type === 'pdf' && <FileText className="h-4 w-4 text-red-600" />}
                              {resource.type === 'quiz' && <CheckCircle className="h-4 w-4 text-purple-600" />}
                              {resource.type === 'template' && <FileText className="h-4 w-4 text-green-600" />}
                              <span className="text-sm font-medium">{resource.title}</span>
                              {resource.duration && (
                                <span className="text-xs text-gray-500">• {resource.duration}</span>
                              )}
                            </div>
                            {resource.isCompleted && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))}
                        {module.resources.length > 3 && (
                          <p className="text-xs text-gray-500 text-center pt-1">
                            +{module.resources.length - 3} weitere Ressourcen
                          </p>
                        )}
                      </div>
                    )}

                    <Button 
                      asChild 
                      className="w-full mt-3"
                      disabled={module.isLocked}
                      variant={module.isLocked ? "outline" : "default"}
                    >
                      <Link href={`/student/course/${module.id}`}>
                        {module.isLocked ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Modul gesperrt
                          </>
                        ) : module.isCompleted ? (
                          <>
                            Modul wiederholen
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            {module.progress > 0 ? 'Fortsetzen' : 'Starten'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentoring Tab (Business & Infinity only) */}
        {hasMentoringAccess && (
          <TabsContent value="mentoring" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Session Booking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Session buchen
                  </CardTitle>
                  <CardDescription>
                    Sie haben noch {enrollment.sessionsRemaining} von {enrollment.totalSessions} Sessions verfügbar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">1:1 Coaching Session</p>
                        <p className="text-sm text-gray-600">60 Minuten</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Individuelle Unterstützung bei Ihren Projekten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Feedback zu Ihrem Fortschritt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Beantwortung aller Ihrer Fragen</span>
                      </li>
                    </ul>

                    <Button asChild className="w-full">
                      <Link href="/student/book-session">
                        <Calendar className="h-4 w-4 mr-2" />
                        Jetzt Session buchen
                      </Link>
                    </Button>
                  </div>

                  {enrollment.sessionsRemaining === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Sie haben alle verfügbaren Sessions genutzt. 
                        {hasInfinityFeatures && ' Als Infinity-Mitglied können Sie jederzeit zusätzliche Sessions anfragen.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Ihre Termine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">
                                {format(session.scheduledAt.toDate(), 'EEE, d. MMM', { locale: de })}
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {format(session.scheduledAt.toDate(), 'HH:mm')} Uhr
                              </p>
                            </div>
                            <Badge>Geplant</Badge>
                          </div>
                          
                          {session.topic && (
                            <p className="text-sm text-gray-600 mb-2">{session.topic}</p>
                          )}

                          {session.meetingLink && (
                            <Button size="sm" variant="outline" className="w-full" asChild>
                              <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4 mr-2" />
                                Zum Meeting
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/termine">
                          Alle Termine ansehen
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Keine anstehenden Termine</p>
                      <Button asChild>
                        <Link href="/student/book-session">
                          Session buchen
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Completed Sessions */}
              {completedSessions > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Abgeschlossene Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {sessions
                        .filter(s => s.status === SESSION_STATUS.COMPLETED)
                        .slice(0, 6)
                        .map(session => (
                          <div key={session.id} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium">
                                {format(session.scheduledAt.toDate(), 'd. MMM yyyy', { locale: de })}
                              </p>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            {session.completionNotes && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {session.completionNotes}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
