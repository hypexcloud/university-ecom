'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Event, View, EventPropGetter } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Button 
} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  LockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  TrendingUpIcon,
  Loader2,
} from 'lucide-react'
import VideoPlayer from './VideoPlayer'
import type { CourseModule, CourseResource, StudentProgress } from '@/lib/course-types'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

const getDateFromTimestamp = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000)
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp)
}

interface CalendarEvent extends Event {
  id: string
  sessionId: string
  studentName: string
  courseType: 'ai' | 'dropshipping'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  meetingUrl?: string
  type: string
}

interface StudentCourseContentProps {
  userRole: 'student'
  userId: string
  courseType: 'ai' | 'dropshipping'
  enrollmentId: string
}

export default function StudentCourseContent({ 
  userRole, 
  userId, 
  courseType, 
  enrollmentId 
}: StudentCourseContentProps) {
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])
  const [modules, setModules] = useState<CourseModule[]>([])
  const [moduleResources, setModuleResources] = useState<Record<string, CourseResource[]>>({})
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourseData()
  }, [userId, enrollmentId, courseType])

  const loadCourseData = async () => {
    setLoading(true)
    try {
      // Load modules
      const modulesRes = await fetch(`/api/student/course-modules?courseType=${courseType}`)
      if (modulesRes.ok) {
        const modulesData = await modulesRes.json()
        setModules(modulesData.modules || [])

        // Load resources for each module
        const resourcesMap: Record<string, CourseResource[]> = {}
        for (const module of modulesData.modules || []) {
          const resourcesRes = await fetch(`/api/student/course-resources?moduleId=${module.id}`)
          if (resourcesRes.ok) {
            const resourcesData = await resourcesRes.json()
            resourcesMap[module.id] = resourcesData.resources || []
          }
        }
        setModuleResources(resourcesMap)
      }

      // Load progress
      const progressRes = await fetch(`/api/student/progress?userId=${userId}&enrollmentId=${enrollmentId}`)
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setProgress(progressData.progress)
      }

      // Load sessions
      const sessionsRes = await fetch(`/api/get-sessions?userId=${userId}`)
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData.sessions || [])
      }
    } catch (error) {
      console.error('Error loading course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteResource = async (moduleId: string, resourceId: string) => {
    if (!progress) return

    try {
      const response = await fetch('/api/student/complete-resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: progress.id,
          resourceId,
          moduleId,
        }),
      })

      if (response.ok) {
        // Reload progress
        await loadCourseData()
      }
    } catch (error) {
      console.error('Error completing resource:', error)
    }
  }

  const handleVideoProgress = async (resourceId: string, watchedSeconds: number, totalSeconds: number) => {
    if (!progress) return

    try {
      await fetch('/api/student/video-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: progress.id,
          resourceId,
          watchedSeconds,
          totalSeconds,
        }),
      })
    } catch (error) {
      console.error('Error updating video progress:', error)
    }
  }

  const getModuleStatus = (module: CourseModule): 'completed' | 'in_progress' | 'locked' => {
    if (!progress) return 'locked'

    if (progress.modulesCompleted.includes(module.id)) {
      return 'completed'
    }

    if (progress.modulesInProgress.includes(module.id) || 
        progress.modulesUnlocked.includes(module.id)) {
      return 'in_progress'
    }

    // First module is always unlocked
    if (module.week === 1) {
      return 'in_progress'
    }

    return 'locked'
  }

  const isResourceCompleted = (resourceId: string): boolean => {
    if (!progress) return false
    return progress.resourcesCompleted.includes(resourceId)
  }

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <PlayIcon className="h-5 w-5 text-blue-500" />
      case 'locked':
        return <LockIcon className="h-5 w-5 text-gray-400" />
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-4 w-4" />
      case 'pdf':
      case 'document':
        return <DownloadIcon className="h-4 w-4" />
      case 'link':
        return <ExternalLinkIcon className="h-4 w-4" />
      case 'template':
        return <DownloadIcon className="h-4 w-4" />
      default:
        return <BookOpenIcon className="h-4 w-4" />
    }
  }

  const calendarEvents: CalendarEvent[] = sessions.map(session => {
    let calendarStatus: CalendarEvent['status'] = 'scheduled'
    if (session.status === 'confirmed') calendarStatus = 'confirmed'
    else if (session.status === 'completed') calendarStatus = 'completed'
    else if (session.status === 'cancelled') calendarStatus = 'cancelled'

    return {
      id: session.id,
      sessionId: session.id,
      title: session.title,
      start: getDateFromTimestamp(session.scheduledStart),
      end: getDateFromTimestamp(session.scheduledEnd),
      studentName: 'You',
      courseType: session.courseType,
      status: calendarStatus,
      meetingUrl: session.meetingUrl,
      type: session.type,
    }
  })

  const eventStyleGetter: EventPropGetter<CalendarEvent> = (event) => {
    let backgroundColor = '#3174ad'
    
    switch (event.status) {
      case 'scheduled':
        backgroundColor = '#fbbf24'
        break
      case 'confirmed':
        backgroundColor = '#10b981'
        break
      case 'completed':
        backgroundColor = '#6b7280'
        break
      case 'cancelled':
        backgroundColor = '#ef4444'
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    const session = sessions.find(s => s.id === event.sessionId)
    if (session) {
      setSelectedSession(session)
      setIsSessionDialogOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  const overallCompletion = progress?.overallCompletion || 0
  const totalModules = modules.length
  const completedModules = progress?.modulesCompleted.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mein Kurs-Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {courseType === 'ai' ? 'KI Automation' : 'EU Dropshipping'} Kurs - Verfolgen Sie Ihren Lernfortschritt
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Gesamtfortschritt</p>
            <p className="text-2xl font-bold text-blue-600">{overallCompletion}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke="#3b82f6" 
                strokeWidth="8" 
                fill="none"
                strokeDasharray={`${overallCompletion * 1.76} 176`}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Kursmodule</TabsTrigger>
          <TabsTrigger value="calendar">Meine Sessions</TabsTrigger>
          <TabsTrigger value="progress">Fortschritt & Statistiken</TabsTrigger>
        </TabsList>

        {/* Course Modules Tab */}
        <TabsContent value="modules">
          <div className="space-y-4">
            {modules.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Noch keine Module verfügbar</p>
                </CardContent>
              </Card>
            ) : (
              modules.map((module) => {
                const status = getModuleStatus(module)
                const resources = moduleResources[module.id] || []
                const isLocked = status === 'locked'

                return (
                  <Card key={module.id} className={`${isLocked ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getModuleIcon(status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">
                                Woche {module.week}: {module.title}
                              </h3>
                              {status === 'completed' && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Abgeschlossen
                                </Badge>
                              )}
                              {status === 'in_progress' && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  In Bearbeitung
                                </Badge>
                              )}
                              {isLocked && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                  Gesperrt
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          {module.duration}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Learning Objectives */}
                      {module.objectives.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2">Lernziele:</h4>
                          <ul className="text-sm space-y-1">
                            {module.objectives.map((objective, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">→</span>
                                <span className="text-gray-700">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Resources */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Lernressourcen</h4>
                        {resources.length === 0 ? (
                          <p className="text-sm text-gray-500">Keine Ressourcen verfügbar</p>
                        ) : (
                          <div className="grid gap-2">
                            {resources.map((resource) => {
                              const completed = isResourceCompleted(resource.id)
                              
                              return (
                                <div 
                                  key={resource.id} 
                                  className={`flex items-center justify-between p-3 rounded-lg ${
                                    completed ? 'bg-green-50' : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    {getResourceIcon(resource.type)}
                                    <span className="text-sm font-medium">{resource.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {resource.type.toUpperCase()}
                                    </Badge>
                                    {completed && (
                                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    )}
                                    {resource.isRequired && (
                                      <Badge variant="secondary" className="text-xs">Pflicht</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {resource.estimatedTime && (
                                      <span className="text-xs text-gray-500">{resource.estimatedTime}</span>
                                    )}
                                    
                                    {/* Video Resource with VideoPlayer */}
                                    {resource.type === 'video' && resource.url && !isLocked && (
                                      <VideoPlayer
                                        resourceId={resource.id}
                                        title={resource.title}
                                        url={resource.url}
                                        provider={resource.videoProvider || 'youtube'}
                                        duration={resource.duration}
                                        onComplete={() => handleCompleteResource(module.id, resource.id)}
                                        onProgress={(watched, total) => handleVideoProgress(resource.id, watched, total)}
                                      />
                                    )}

                                    {/* Non-video resources */}
                                    {resource.type !== 'video' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        disabled={isLocked}
                                        onClick={() => {
                                          if (resource.url) {
                                            window.open(resource.url, '_blank')
                                            if (!completed) {
                                              handleCompleteResource(module.id, resource.id)
                                            }
                                          }
                                        }}
                                      >
                                        {resource.type === 'link' ? 'Öffnen' : 'Download'}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Session Info */}
                        {module.hasSession && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">1-zu-1 Mentoring-Session</span>
                              </div>
                            </div>
                            {!isLocked && (
                              <p className="text-xs text-blue-600 mt-1">
                                Bearbeiten Sie die Materialien vor Ihrer Session
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Calendar Tab - (same as before) */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Meine Mentoring-Sessions
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Geplant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Bestätigt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span>Abgeschlossen</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 md:h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={currentView}
                  onView={setCurrentView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab - (same as before) */}
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  Lernfortschritt
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Kursabschluss</span>
                      <span>{overallCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${overallCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Module abgeschlossen</span>
                      <span>{completedModules}/{totalModules}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${totalModules > 0 ? (completedModules / totalModules) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sessions abgeschlossen</span>
                      <span>{progress?.sessionsCompleted || 0}/{progress?.totalSessions || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${
                            progress?.totalSessions 
                              ? ((progress.sessionsCompleted / progress.totalSessions) * 100) 
                              : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-bold text-lg">Nächste Meilensteine</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modules
                    .filter(m => getModuleStatus(m) !== 'completed')
                    .slice(0, 3)
                    .map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Woche {module.week}</p>
                          <p className="text-xs text-gray-600">{module.title}</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {getModuleStatus(module) === 'in_progress' ? 'Aktiv' : 'Bald'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog - (same as before) */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
            <DialogDescription>
              {selectedSession?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Datum & Uhrzeit</label>
                  <p className="text-sm">
                    {format(getDateFromTimestamp(selectedSession.scheduledStart), 'PPP p')} - 
                    {format(getDateFromTimestamp(selectedSession.scheduledEnd), 'p')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm">
                    <Badge className={
                      selectedSession.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedSession.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      selectedSession.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {selectedSession.status}
                    </Badge>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Meeting-Link</label>
                {selectedSession.meetingUrl ? (
                  <div className="mt-1">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => window.open(selectedSession.meetingUrl, '_blank')}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Session beitreten
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Meeting-Link wird vor der Session bereitgestellt</p>
                )}
              </div>

              {selectedSession.agenda && selectedSession.agenda.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Session-Agenda</label>
                  <ul className="mt-1 text-sm space-y-1">
                    {selectedSession.agenda.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                  Schließen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
