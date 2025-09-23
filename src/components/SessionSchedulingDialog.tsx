'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, ClockIcon, UserIcon, VideoIcon } from 'lucide-react'
import { CourseType, MentoringSession } from '@/lib/types'

interface SessionSchedulingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSchedule: (sessionData: Partial<MentoringSession>) => Promise<void>
  students: Array<{
    id: string
    name: string
    email: string
    courseType: CourseType
    timeZone: string
  }>
  instructors: Array<{
    id: string
    name: string
    email: string
  }>
}

const SESSION_TYPES = [
  { value: 'initial_consultation', label: 'Initial Consultation' },
  { value: 'weekly_check_in', label: 'Weekly Check-in' },
  { value: 'progress_review', label: 'Progress Review' },
  { value: 'final_review', label: 'Final Review' },
  { value: 'ad_hoc', label: 'Ad-hoc Session' },
]

const MEETING_TYPES = [
  { value: 'zoom', label: 'Zoom Meeting' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'in_person', label: 'In Person' },
]

const TIME_ZONES = [
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'UTC', label: 'UTC' },
]

export default function SessionSchedulingDialog({
  open,
  onOpenChange,
  onSchedule,
  students,
  instructors,
}: SessionSchedulingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedInstructor, setSelectedInstructor] = useState<string>('')
  const [sessionType, setSessionType] = useState<string>('')
  const [meetingType, setMeetingType] = useState<string>('zoom')
  const [timeZone, setTimeZone] = useState<string>('Europe/Berlin')
  const [duration, setDuration] = useState<string>('60')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [meetingUrl, setMeetingUrl] = useState<string>('')
  const [agenda, setAgenda] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // Generate time slots for a day (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          value: timeString,
          label: timeString,
        })
      }
    }
    return slots
  }

  // Generate date options for the next 30 days
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends for business hours
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0], // YYYY-MM-DD format
          label: format(date, 'EEEE, MMMM d, yyyy'),
        })
      }
    }
    return dates
  }

  const timeSlots = generateTimeSlots()
  const dateOptions = generateDateOptions()

  // Auto-generate title based on session type and student
  useEffect(() => {
    if (sessionType && selectedStudent) {
      const student = students.find(s => s.id === selectedStudent)
      const sessionTypeLabel = SESSION_TYPES.find(t => t.value === sessionType)?.label
      
      if (student && sessionTypeLabel) {
        setTitle(`${sessionTypeLabel} - ${student.name}`)
      }
    }
  }, [sessionType, selectedStudent, students])

  // Auto-set timezone based on selected student
  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s.id === selectedStudent)
      if (student?.timeZone) {
        setTimeZone(student.timeZone)
      }
    }
  }, [selectedStudent, students])

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !selectedStudent || !selectedInstructor || !sessionType) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const student = students.find(s => s.id === selectedStudent)
      const instructor = instructors.find(i => i.id === selectedInstructor)
      
      if (!student || !instructor) {
        throw new Error('Invalid student or instructor selection')
      }

      // Create date objects
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const scheduledStart = new Date(selectedDate)
      scheduledStart.setHours(hours, minutes, 0, 0)
      
      const scheduledEnd = new Date(scheduledStart)
      scheduledEnd.setMinutes(scheduledStart.getMinutes() + parseInt(duration))

      const sessionData: Partial<MentoringSession> = {
        studentId: selectedStudent,
        instructorId: selectedInstructor,
        courseId: `${student.courseType}-course-1`,
        courseType: student.courseType,
        title: title || `${SESSION_TYPES.find(t => t.value === sessionType)?.label} - ${student.name}`,
        description,
        type: sessionType as any,
        scheduledStart: scheduledStart as any,
        scheduledEnd: scheduledEnd as any,
        timeZone,
        status: 'scheduled',
        isRescheduled: false,
        meetingType: meetingType as any,
        meetingUrl,
        agenda: agenda.split('\n').filter(item => item.trim() !== ''),
        remindersSent: {
          student24h: false,
          student1h: false,
          instructor24h: false,
          instructor15min: false,
        },
      }

      await onSchedule(sessionData)
      
      // Reset form
      setSelectedDate('')
      setSelectedTime('')
      setSelectedStudent('')
      setSelectedInstructor('')
      setSessionType('')
      setMeetingType('zoom')
      setTimeZone('Europe/Berlin')
      setDuration('60')
      setTitle('')
      setDescription('')
      setMeetingUrl('')
      setAgenda('')
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error scheduling session:', error)
      alert('Failed to schedule session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Schedule New Session
          </DialogTitle>
          <DialogDescription>
            Create a new mentoring session with a student.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Student and Instructor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student *</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-start gap-2">
                        <UserIcon className="h-4 w-4 mt-0.5" />
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">
                            {student.courseType.toUpperCase()} • {student.timeZone}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <div className="flex items-start gap-2">
                        <UserIcon className="h-4 w-4 mt-0.5" />
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-xs text-gray-500">{instructor.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Type and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionType">Session Type *</Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? 
                    dateOptions.find(d => d.value === selectedDate)?.label : 
                    <span className="text-muted-foreground">Select a date</span>
                  }
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {dateOptions.map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {selectedTime ? selectedTime : <span className="text-muted-foreground">Select time</span>}
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        {slot.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Zone */}
          <div className="space-y-2">
            <Label htmlFor="timeZone">Time Zone</Label>
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEETING_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <VideoIcon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingUrl">Meeting URL</Label>
              <Input
                id="meetingUrl"
                placeholder="https://zoom.us/j/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., Initial Consultation - John Doe"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agenda">Session Agenda</Label>
            <Textarea
              id="agenda"
              placeholder="Enter each agenda item on a new line..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Enter each agenda item on a separate line
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSchedule} 
            disabled={loading || !selectedDate || !selectedTime || !selectedStudent || !selectedInstructor || !sessionType}
          >
            {loading ? 'Scheduling...' : 'Schedule Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
