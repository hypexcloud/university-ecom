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
  TrendingUpIcon,
  Users,
  GraduationCap,
  MessageSquareIcon,
  ExternalLinkIcon
} from 'lucide-react'
import { MentoringSession, CourseType } from '@/lib/types'
import SessionSchedulingDialog from './SessionSchedulingDialog'

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

// Calendar event interface
interface CalendarEvent extends Event {
  id: string
  sessionId: string
  studentName: string
  courseType: CourseType
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  meetingUrl?: string
  type: 'initial_consultation' | 'weekly_check_in' | 'progress_review' | 'final_review' | 'ad_hoc'
}

interface AdminCourseManagementProps {
  userRole: 'admin' | 'instructor'
  userId: string
}

export default function AdminCourseManagement({ userRole, userId }: AdminCourseManagementProps) {
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<MentoringSession[]>([])
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for students and instructors
  const mockStudents = [
    {
      id: 'student1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      courseType: 'ai' as CourseType,
      timeZone: 'Europe/Berlin',
    },
    {
      id: 'student2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      courseType: 'dropshipping' as CourseType,
      timeZone: 'America/New_York',
    },
    {
      id: 'student3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      courseType: 'ai' as CourseType,
      timeZone: 'Europe/Berlin',
    },
  ]

  const mockInstructors = [
    {
      id: 'instructor1',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@example.com',
    },
    {
      id: 'instructor2',
      name: 'Prof. David Brown',
      email: 'david.brown@example.com',
    },
  ]

  // Mock sessions data
  useEffect(() => {
    const mockSessions: MentoringSession[] = [
      {
        id: '1',
        studentId: 'student1',
        instructorId: 'instructor1',
        courseId: 'ai-course-1',
        courseType: 'ai',
        title: 'Initial Consultation - John Doe',
        description: 'First session to understand goals and create learning plan',
        type: 'initial_consultation',
        week: 1,
        scheduledStart: new Date(2025, 0, 15, 10, 0) as any,
        scheduledEnd: new Date(2025, 0, 15, 11, 0) as any,
        timeZone: 'Europe/Berlin',
        status: 'scheduled',
        isRescheduled: false,
        meetingType: 'zoom',
        meetingUrl: 'https://zoom.us/j/123456789',
        agenda: [
          'Introduction and goal setting',
          'Course overview',
          'Learning plan creation',
          'Q&A session'
        ],
        remindersSent: {
          student24h: false,
          student1h: false,
          instructor24h: false,
          instructor15min: false,
        },
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
        createdBy: 'admin1',
      },
      {
        id: '2',
        studentId: 'student2',
        instructorId: 'instructor1',
        courseId: 'dropshipping-course-1',
        courseType: 'dropshipping',
        title: 'Weekly Check-in - Jane Smith',
        description: 'Review progress on product research',
        type: 'weekly_check_in',
        week: 3,
        scheduledStart: new Date(2025, 0, 18, 14, 0) as any,
        scheduledEnd: new Date(2025, 0, 18, 15, 0) as any,
        timeZone: 'Europe/Berlin',
        status: 'confirmed',
        isRescheduled: false,
        meetingType: 'zoom',
        meetingUrl: 'https://zoom.us/j/987654321',
        agenda: [
          'Progress review',
          'Product research discussion',
          'Supplier validation',
          'Next week planning'
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
      },
    ]

    setSessions(mockSessions)
    setLoading(false)
  }, [])

  // Convert sessions to calendar events
  const calendarEvents: CalendarEvent[] = sessions.map(session => {
    let calendarStatus: CalendarEvent['status'] = 'scheduled'
    if (session.status === 'confirmed') calendarStatus = 'confirmed'
    else if (session.status === 'completed') calendarStatus = 'completed'
    else if (session.status === 'cancelled') calendarStatus = 'cancelled'
    else if (session.status === 'in_progress') calendarStatus = 'confirmed'
    else if (session.status === 'no_show') calendarStatus = 'cancelled'

    const student = mockStudents.find(s => s.id === session.studentId)

    return {
      id: session.id,
      sessionId: session.id,
      title: session.title,
      start: getDateFromTimestamp(session.scheduledStart),
      end: getDateFromTimestamp(session.scheduledEnd),
      studentName: student?.name || 'Unknown Student',
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

  const handleScheduleSession = async (sessionData: any) => {
    try {
      console.log('Scheduling session:', sessionData)
      // Here you would call your Firebase service
      // await MentoringSessionService.createSession(sessionData)
      
      // For now, just add to local state
      const newSession = {
        id: Date.now().toString(),
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setSessions([...sessions, newSession])
      
      alert('Session scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling session:', error)
      alert('Failed to schedule session. Please try again.')
    }
  }

  const getUpcomingSessions = () => {
    const now = new Date()
    return sessions
      .filter(session => {
        const sessionStart = getDateFromTimestamp(session.scheduledStart)
        return sessionStart > now && ['scheduled', 'confirmed'].includes(session.status)
      })
      .sort((a, b) => {
        const aStart = getDateFromTimestamp(a.scheduledStart)
        const bStart = getDateFromTimestamp(b.scheduledStart)
        return aStart.getTime() - bStart.getTime()
      })
      .slice(0, 5)
  }

  const getSessionStats = () => {
    const totalSessions = sessions.length
    const completedSessions = sessions.filter(s => s.status === 'completed').length
    const upcomingSessions = sessions.filter(s => {
      const sessionStart = getDateFromTimestamp(s.scheduledStart)
      return sessionStart > new Date() && ['scheduled', 'confirmed'].includes(s.status)
    }).length
    const activeStudents = new Set(sessions.map(s => s.studentId)).size

    return {
      totalSessions,
      completedSessions,
      upcomingSessions,
      activeStudents
    }
  }

  const stats = getSessionStats()
  const upcomingSessions = getUpcomingSessions()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'admin' ? 'Course Administration' : 'My Teaching Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage mentoring sessions, track student progress, and oversee course delivery
          </p>
        </div>
        <Button 
          onClick={() => setIsSchedulingDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Session Calendar Overview
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[600px]">
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

      {/* Students Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {mockStudents.map((student) => {
              const studentSessions = sessions.filter(s => s.studentId === student.id)
              const completedSessions = studentSessions.filter(s => s.status === 'completed').length
              const totalSessions = studentSessions.length
              const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
              
              return (
                <div key={student.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{progressPercentage}%</p>
                      <p className="text-xs text-gray-500">{completedSessions}/{totalSessions} sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {student.courseType.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">{student.timeZone}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <TrendingUpIcon className="h-3 w-3 mr-1" />
                        View Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquareIcon className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                    <Button size="sm" onClick={() => setIsSchedulingDialogOpen(true)}>
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm">
                    {mockStudents.find(s => s.id === selectedSession.studentId)?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Instructor</label>
                  <p className="text-sm">
                    {mockInstructors.find(i => i.id === selectedSession.instructorId)?.name}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Meeting Link</label>
                {selectedSession.meetingUrl ? (
                  <div className="mt-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedSession.meetingUrl, '_blank')}
                    >
                      <ExternalLinkIcon className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No meeting link available</p>
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
                <Button variant="outline">
                  Reschedule
                </Button>
                <Button variant="outline">
                  Cancel Session
                </Button>
                <Button onClick={() => setIsSessionDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Scheduling Dialog */}
      <SessionSchedulingDialog
        open={isSchedulingDialogOpen}
        onOpenChange={setIsSchedulingDialogOpen}
        onSchedule={handleScheduleSession}
        students={mockStudents}
        instructors={mockInstructors}
      />
    </div>
  )
}
