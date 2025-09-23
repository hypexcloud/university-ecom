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
  PlusIcon,
  SettingsIcon,
  PlayIcon,
  CheckCircleIcon,
  LockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  TrendingUpIcon
} from 'lucide-react'
import { MentoringSession, MentoringProgress, CourseType } from '@/lib/types'

// Import CSS for react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Calendar setup
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Helper function to handle both Timestamp and Date objects
const getDateFromTimestamp = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000)
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp)
}

// Calendar event interface - simplified status to match what we use in calendar
interface CalendarEvent extends Event {
  id: string
  sessionId: string
  studentName: string
  courseType: CourseType
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  meetingUrl?: string
  type: 'initial_consultation' | 'weekly_check_in' | 'progress_review' | 'final_review' | 'ad_hoc'
}

interface StudentCourseContentProps {
  userRole: 'student'
  userId: string
  courseType: CourseType
  enrollmentId: string
}

export default function StudentCourseContent({ userRole, userId, courseType, enrollmentId }: StudentCourseContentProps) {
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<MentoringSession[]>([])
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [progress, setProgress] = useState({
    overallCompletion: 60,
    sessionsCompleted: 3,
    totalSessions: 6,
    currentModule: 3,
    totalModules: 8
  })

  // Mock course modules for student view
  const courseModules = [
    {
      id: 'week-1',
      week: 1,
      title: 'Introduction to AI Fundamentals',
      description: 'Learn the basics of artificial intelligence and machine learning concepts.',
      status: 'completed',
      duration: '2 hours',
      resources: [
        { id: '1', title: 'AI Fundamentals Guide', type: 'pdf', url: '#' },
        { id: '2', title: 'Introduction Video', type: 'video', url: '#' },
        { id: '3', title: 'Exercise Template', type: 'template', url: '#' }
      ],
      hasSession: true,
      sessionDate: new Date(2025, 0, 8),
      sessionCompleted: true
    },
    {
      id: 'week-2',
      week: 2,
      title: 'Machine Learning Basics',
      description: 'Understand different types of machine learning and their applications.',
      status: 'completed',
      duration: '2.5 hours',
      resources: [
        { id: '4', title: 'ML Algorithms Overview', type: 'pdf', url: '#' },
        { id: '5', title: 'Hands-on Tutorial', type: 'video', url: '#' },
        { id: '6', title: 'Practice Exercises', type: 'template', url: '#' }
      ],
      hasSession: true,
      sessionDate: new Date(2025, 0, 15),
      sessionCompleted: true
    },
    {
      id: 'week-3',
      week: 3,
      title: 'Deep Learning Foundations',
      description: 'Dive into neural networks and deep learning architectures.',
      status: 'in_progress',
      duration: '3 hours',
      resources: [
        { id: '7', title: 'Neural Networks Guide', type: 'pdf', url: '#' },
        { id: '8', title: 'Deep Learning Video', type: 'video', url: '#' },
        { id: '9', title: 'TensorFlow Tutorial', type: 'link', url: '#' }
      ],
      hasSession: true,
      sessionDate: new Date(2025, 0, 22),
      sessionCompleted: false
    },
    {
      id: 'week-4',
      week: 4,
      title: 'Computer Vision Applications',
      description: 'Explore image processing and computer vision techniques.',
      status: 'locked',
      duration: '2.5 hours',
      resources: [
        { id: '10', title: 'Computer Vision Basics', type: 'pdf', url: '#' },
        { id: '11', title: 'Image Processing Demo', type: 'video', url: '#' }
      ],
      hasSession: true,
      sessionDate: new Date(2025, 0, 29),
      sessionCompleted: false
    }
  ]

  // Mock data for demonstration - replace with actual Firebase calls
  useEffect(() => {
    const mockSessions: MentoringSession[] = [
      {
        id: '1',
        studentId: userId,
        instructorId: 'instructor1',
        courseId: 'ai-course-1',
        courseType: courseType,
        title: 'Week 3 - Deep Learning Session',
        description: 'Review neural networks and discuss your progress with TensorFlow',
        type: 'weekly_check_in',
        week: 3,
        scheduledStart: new Date(2025, 0, 22, 14, 0) as any,
        scheduledEnd: new Date(2025, 0, 22, 15, 0) as any,
        timeZone: 'Europe/Berlin',
        status: 'confirmed',
        isRescheduled: false,
        meetingType: 'zoom',
        meetingUrl: 'https://zoom.us/j/123456789',
        agenda: [
          'Review Week 2 exercises',
          'Introduction to neural networks',
          'TensorFlow setup and first model',
          'Q&A and next steps'
        ],
        remindersSent: {
          student24h: true,
          student1h: false,
          instructor24h: true,
          instructor15min: false,
        },
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
        createdBy: 'admin1',
      }
    ]

    setSessions(mockSessions)
    setLoading(false)
  }, [userId, courseType])

  // Convert sessions to calendar events
  const calendarEvents: CalendarEvent[] = sessions.map(session => {
    let calendarStatus: CalendarEvent['status'] = 'scheduled'
    if (session.status === 'confirmed') calendarStatus = 'confirmed'
    else if (session.status === 'completed') calendarStatus = 'completed'
    else if (session.status === 'cancelled') calendarStatus = 'cancelled'
    else if (session.status === 'in_progress') calendarStatus = 'confirmed'
    else if (session.status === 'no_show') calendarStatus = 'cancelled'

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

  // Event style getter for calendar
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
        return <DownloadIcon className="h-4 w-4" />
      case 'link':
        return <ExternalLinkIcon className="h-4 w-4" />
      case 'template':
        return <DownloadIcon className="h-4 w-4" />
      default:
        return <BookOpenIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Course Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {courseType.toUpperCase()} Course - Track your learning progress and manage sessions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-2xl font-bold text-blue-600">{progress.overallCompletion}%</p>
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
                strokeDasharray={`${progress.overallCompletion * 1.76} 176`}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Course Modules</TabsTrigger>
          <TabsTrigger value="calendar">My Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress & Stats</TabsTrigger>
        </TabsList>

        {/* Course Modules Tab */}
        <TabsContent value="modules">
          <div className="space-y-4">
            {courseModules.map((module) => (
              <Card key={module.id} className={`${module.status === 'locked' ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getModuleIcon(module.status)}
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Week {module.week}: {module.title}
                          {module.status === 'completed' && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                          {module.status === 'in_progress' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              In Progress
                            </Badge>
                          )}
                          {module.status === 'locked' && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              Locked
                            </Badge>
                          )}
                        </CardTitle>
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
                  {/* Resources */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Learning Resources</h4>
                    <div className="grid gap-2">
                      {module.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            <span className="text-sm font-medium">{resource.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {resource.type.toUpperCase()}
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={module.status === 'locked'}
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            {resource.type === 'link' ? 'Open' : 'Download'}
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Session Info */}
                    {module.hasSession && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">1-on-1 Mentoring Session</span>
                            {module.sessionCompleted && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {format(module.sessionDate, 'MMM d, yyyy')}
                          </div>
                        </div>
                        {!module.sessionCompleted && module.status !== 'locked' && (
                          <p className="text-xs text-blue-600 mt-1">
                            Complete the materials above before your session
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  My Mentoring Sessions
                </CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span>Completed</span>
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

        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Completion</span>
                      <span>{progress.overallCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress.overallCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Modules Completed</span>
                      <span>{Math.floor(progress.overallCompletion/100 * progress.totalModules)}/{progress.totalModules}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(Math.floor(progress.overallCompletion/100 * progress.totalModules) / progress.totalModules) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sessions Completed</span>
                      <span>{progress.sessionsCompleted}/{progress.totalSessions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(progress.sessionsCompleted / progress.totalSessions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Week 3 Session</p>
                      <p className="text-xs text-gray-600">Deep Learning Foundations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Jan 22</p>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        This Week
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Module 4 Unlock</p>
                      <p className="text-xs text-gray-600">Computer Vision Applications</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Jan 29</p>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Next Week
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Mid-Course Review</p>
                      <p className="text-xs text-gray-600">Progress assessment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Feb 5</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Upcoming
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
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
                  <label className="text-sm font-medium text-gray-700">Date & Time</label>
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
                <label className="text-sm font-medium text-gray-700">Meeting Link</label>
                {selectedSession.meetingUrl ? (
                  <div className="mt-1">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => window.open(selectedSession.meetingUrl, '_blank')}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Join Session
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Meeting link will be provided closer to session time</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Session Agenda</label>
                <ul className="mt-1 text-sm space-y-1">
                  {selectedSession.agenda.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
