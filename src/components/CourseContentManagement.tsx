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
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  PlusIcon,
  SettingsIcon
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

interface CourseContentManagementProps {
  userRole: 'student' | 'admin' | 'instructor'
  userId: string
}

export default function CourseContentManagement({ userRole, userId }: CourseContentManagementProps) {
  const [currentView, setCurrentView] = useState<View>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<MentoringSession[]>([])
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration - replace with actual Firebase calls
  useEffect(() => {
    const mockSessions: MentoringSession[] = [
      {
        id: '1',
        studentId: 'student1',
        instructorId: 'instructor1',
        courseId: 'ai-course-1',
        courseType: 'ai',
        title: 'Initial Consultation - AI Course',
        description: 'First session to understand goals and create learning plan',
        type: 'initial_consultation',
        week: 1,
        scheduledStart: new Date(2025, 0, 15, 10, 0) as any, // Jan 15, 10:00 AM
        scheduledEnd: new Date(2025, 0, 15, 11, 0) as any,   // Jan 15, 11:00 AM
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
        title: 'Weekly Check-in - Dropshipping',
        description: 'Review progress on product research',
        type: 'weekly_check_in',
        week: 3,
        scheduledStart: new Date(2025, 0, 18, 14, 0) as any, // Jan 18, 2:00 PM
        scheduledEnd: new Date(2025, 0, 18, 15, 0) as any,   // Jan 18, 3:00 PM
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
    // Map session status to simplified calendar status
    let calendarStatus: CalendarEvent['status'] = 'scheduled'
    if (session.status === 'confirmed') calendarStatus = 'confirmed'
    else if (session.status === 'completed') calendarStatus = 'completed'
    else if (session.status === 'cancelled') calendarStatus = 'cancelled'
    else if (session.status === 'in_progress') calendarStatus = 'confirmed' // Show in-progress as confirmed
    else if (session.status === 'no_show') calendarStatus = 'cancelled' // Show no-show as cancelled

    return {
      id: session.id,
      sessionId: session.id,
      title: session.title,
      start: getDateFromTimestamp(session.scheduledStart),
      end: getDateFromTimestamp(session.scheduledEnd),
      studentName: 'John Doe', // This would come from user lookup
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
        backgroundColor = '#fbbf24' // yellow
        break
      case 'confirmed':
        backgroundColor = '#10b981' // green
        break
      case 'completed':
        backgroundColor = '#6b7280' // gray
        break
      case 'cancelled':
        backgroundColor = '#ef4444' // red
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

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your {userRole === 'student' ? 'learning sessions' : 'mentoring sessions'} and track progress
          </p>
        </div>
        {(userRole === 'admin' || userRole === 'instructor') && (
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Schedule Session
          </Button>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          {(userRole === 'admin' || userRole === 'instructor') && (
            <TabsTrigger value="management">Session Management</TabsTrigger>
          )}
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Session Calendar
                </CardTitle>
                <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Cancelled</span>
                    </div>
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
                  onView={handleViewChange}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Content Tab */}
        <TabsContent value="content">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  Course Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock course modules */}
                  {[1, 2, 3, 4].map((week) => (
                    <div key={week} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Week {week}: Module Title</h3>
                        <span className="text-sm text-gray-500">
                          {week <= 2 ? 'Completed' : week === 3 ? 'In Progress' : 'Locked'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        Description of what will be covered in this module.
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          2 hours
                        </span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          1-on-1 Session
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Course Completion</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessions Completed</span>
                      <span>3/6</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Week 4 Assignment</p>
                      <p className="text-xs text-gray-600">Due in 3 days</p>
                    </div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Progress Review Session</p>
                      <p className="text-xs text-gray-600">Jan 22, 2025</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Session Management Tab (Admin/Instructor only) */}
        {(userRole === 'admin' || userRole === 'instructor') && (
          <TabsContent value="management">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Session Management</CardTitle>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      Availability Settings
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{session.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.status}
                            </span>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{format(getDateFromTimestamp(session.scheduledStart), 'PPP p')}</span>
                          <span>{session.courseType.toUpperCase()}</span>
                          <span>Week {session.week}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedSession.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedSession.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      selectedSession.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedSession.status}
                    </span>
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
                {(userRole === 'admin' || userRole === 'instructor') && (
                  <>
                    <Button variant="outline">
                      Reschedule
                    </Button>
                    <Button variant="outline">
                      Cancel Session
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsSessionDialogOpen(false)}>
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
