/**
 * Booking System Utilities
 * 
 * Handles session booking, availability checking, and calendar logic
 */

import { db } from './firebase/config'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  updateDoc,
  Timestamp,
  orderBy 
} from 'firebase/firestore'
import { addMinutes, format, parse, isBefore, isAfter, isSameDay } from 'date-fns'

/**
 * Session types
 */
export const SESSION_TYPES = {
  ERSTGESPRAECH: 'erstgespraech',
  FOLLOWUP: 'followup',
  SUPPORT: 'support'
} as const

export type SessionType = typeof SESSION_TYPES[keyof typeof SESSION_TYPES]

/**
 * Session status
 */
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  IN_PROGRESS: 'in_progress'
} as const

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

/**
 * Meeting types
 */
export const MEETING_TYPES = {
  ZOOM: 'zoom',
  PHONE: 'phone',
  IN_PERSON: 'in_person'
} as const

export type MeetingType = typeof MEETING_TYPES[keyof typeof MEETING_TYPES]

/**
 * Session interface
 */
export interface Session {
  id?: string
  userId: string
  coachId: string
  enrollmentId: string
  type: SessionType
  status: SessionStatus
  scheduledAt: Timestamp
  duration: number // minutes
  meetingType: MeetingType
  meetingLink?: string
  phoneNumber?: string
  location?: string
  topic?: string
  notes?: string
  agenda?: string[]
  completionNotes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Availability slot interface
 */
export interface AvailabilitySlot {
  dayOfWeek: number // 0-6
  startTime: string // HH:mm
  endTime: string // HH:mm
  timezone: string
  isActive: boolean
}

/**
 * Coach availability interface
 */
export interface CoachAvailability {
  id?: string
  coachId: string
  slots: AvailabilitySlot[]
  bufferMinutes: number // Buffer between sessions
  sessionDuration: number // Default session duration
  maxSessionsPerDay: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Time slot for booking
 */
export interface TimeSlot {
  start: Date
  end: Date
  isAvailable: boolean
  coachId: string
}

/**
 * Get remaining session count for a user's enrollment
 */
export async function getRemainingSessionCount(enrollmentId: string): Promise<number> {
  try {
    const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId))
    
    if (!enrollmentDoc.exists()) {
      throw new Error('Enrollment not found')
    }
    
    const enrollment = enrollmentDoc.data()
    const remaining = enrollment.accessDetails?.mentoringSessionsRemaining ?? 0
    
    return remaining
  } catch (error) {
    console.error('Error getting remaining sessions:', error)
    throw error
  }
}

/**
 * Check if user can book a session
 */
export async function canBookSession(enrollmentId: string): Promise<{ canBook: boolean; reason?: string; remaining: number }> {
  try {
    const remaining = await getRemainingSessionCount(enrollmentId)
    
    if (remaining === 999) {
      // Infinity plan
      return { canBook: true, remaining: 999 }
    }
    
    if (remaining <= 0) {
      return { 
        canBook: false, 
        reason: 'Keine Sessions mehr verfügbar. Bitte upgraden Sie Ihren Plan.',
        remaining: 0
      }
    }
    
    return { canBook: true, remaining }
  } catch (error) {
    console.error('Error checking booking eligibility:', error)
    return { 
      canBook: false, 
      reason: 'Fehler beim Prüfen der Berechtigung',
      remaining: 0
    }
  }
}

/**
 * Get coach's booked sessions for a specific date
 */
export async function getCoachBookedSessions(
  coachId: string,
  date: Date
): Promise<Session[]> {
  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('coachId', '==', coachId),
      where('status', '==', SESSION_STATUS.SCHEDULED),
      where('scheduledAt', '>=', Timestamp.fromDate(startOfDay)),
      where('scheduledAt', '<=', Timestamp.fromDate(endOfDay))
    )
    
    const snapshot = await getDocs(sessionsQuery)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session))
  } catch (error) {
    console.error('Error getting booked sessions:', error)
    return []
  }
}

/**
 * Get available time slots for a coach on a specific date
 */
export async function getAvailableTimeSlots(
  coachId: string,
  date: Date,
  sessionDuration: number = 60
): Promise<TimeSlot[]> {
  try {
    // Get coach availability settings
    const availabilityDoc = await getDoc(doc(db, 'availability', coachId))
    
    if (!availabilityDoc.exists()) {
      return []
    }
    
    const availability = availabilityDoc.data() as CoachAvailability
    const dayOfWeek = date.getDay()
    
    // Find availability for this day
    const daySlot = availability.slots.find(
      slot => slot.dayOfWeek === dayOfWeek && slot.isActive
    )
    
    if (!daySlot) {
      return []
    }
    
    // Get booked sessions for this day
    const bookedSessions = await getCoachBookedSessions(coachId, date)
    
    // Generate time slots
    const slots: TimeSlot[] = []
    const startTime = parse(daySlot.startTime, 'HH:mm', date)
    const endTime = parse(daySlot.endTime, 'HH:mm', date)
    
    let currentSlot = startTime
    
    while (isBefore(currentSlot, endTime)) {
      const slotEnd = addMinutes(currentSlot, sessionDuration)
      
      // Check if this slot conflicts with any booked session
      const isAvailable = !bookedSessions.some(session => {
        const sessionStart = session.scheduledAt.toDate()
        const sessionEnd = addMinutes(sessionStart, session.duration)
        
        // Check for overlap
        return (
          (isAfter(currentSlot, sessionStart) && isBefore(currentSlot, sessionEnd)) ||
          (isAfter(slotEnd, sessionStart) && isBefore(slotEnd, sessionEnd)) ||
          (isBefore(currentSlot, sessionStart) && isAfter(slotEnd, sessionEnd))
        )
      })
      
      // Don't show slots in the past
      const now = new Date()
      const isInFuture = isAfter(currentSlot, now)
      
      slots.push({
        start: new Date(currentSlot),
        end: new Date(slotEnd),
        isAvailable: isAvailable && isInFuture,
        coachId
      })
      
      // Move to next slot (with buffer)
      currentSlot = addMinutes(currentSlot, sessionDuration + (availability.bufferMinutes || 15))
    }
    
    return slots
  } catch (error) {
    console.error('Error getting available time slots:', error)
    return []
  }
}

/**
 * Create a new session booking
 */
export async function createSessionBooking(params: {
  userId: string
  coachId: string
  enrollmentId: string
  scheduledAt: Date
  type: SessionType
  meetingType: MeetingType
  duration?: number
  topic?: string
  notes?: string
  meetingLink?: string
  phoneNumber?: string
  location?: string
}): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    // Check if user can book
    const eligibility = await canBookSession(params.enrollmentId)
    
    if (!eligibility.canBook) {
      return {
        success: false,
        error: eligibility.reason || 'Cannot book session'
      }
    }
    
    // Check if slot is still available
    const slots = await getAvailableTimeSlots(
      params.coachId,
      params.scheduledAt,
      params.duration || 60
    )
    
    const requestedSlot = slots.find(slot => 
      isSameDay(slot.start, params.scheduledAt) &&
      slot.start.getTime() === params.scheduledAt.getTime()
    )
    
    if (!requestedSlot || !requestedSlot.isAvailable) {
      return {
        success: false,
        error: 'Dieser Zeitslot ist nicht mehr verfügbar'
      }
    }
    
    // Create session
    const sessionData: Omit<Session, 'id'> = {
      userId: params.userId,
      coachId: params.coachId,
      enrollmentId: params.enrollmentId,
      type: params.type,
      status: SESSION_STATUS.SCHEDULED,
      scheduledAt: Timestamp.fromDate(params.scheduledAt),
      duration: params.duration || 60,
      meetingType: params.meetingType,
      meetingLink: params.meetingLink,
      phoneNumber: params.phoneNumber,
      location: params.location,
      topic: params.topic,
      notes: params.notes,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const sessionRef = await addDoc(collection(db, 'sessions'), sessionData)
    
    // Decrement remaining sessions (unless infinity plan)
    if (eligibility.remaining !== 999) {
      await updateDoc(doc(db, 'enrollments', params.enrollmentId), {
        'accessDetails.mentoringSessionsRemaining': eligibility.remaining - 1,
        updatedAt: Timestamp.now()
      })
    }
    
    // TODO: Send confirmation email
    // TODO: Create calendar invite
    
    return {
      success: true,
      sessionId: sessionRef.id
    }
  } catch (error: any) {
    console.error('Error creating session booking:', error)
    return {
      success: false,
      error: error.message || 'Fehler beim Erstellen der Buchung'
    }
  }
}

/**
 * Cancel a session
 */
export async function cancelSession(
  sessionId: string,
  enrollmentId: string,
  refundSession: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update session status
    await updateDoc(doc(db, 'sessions', sessionId), {
      status: SESSION_STATUS.CANCELLED,
      updatedAt: Timestamp.now()
    })
    
    // Refund session if requested
    if (refundSession) {
      const enrollment = await getDoc(doc(db, 'enrollments', enrollmentId))
      if (enrollment.exists()) {
        const currentRemaining = enrollment.data().accessDetails?.mentoringSessionsRemaining ?? 0
        
        // Don't refund if infinity plan
        if (currentRemaining !== 999) {
          await updateDoc(doc(db, 'enrollments', enrollmentId), {
            'accessDetails.mentoringSessionsRemaining': currentRemaining + 1,
            updatedAt: Timestamp.now()
          })
        }
      }
    }
    
    // TODO: Send cancellation email
    
    return { success: true }
  } catch (error: any) {
    console.error('Error cancelling session:', error)
    return {
      success: false,
      error: error.message || 'Fehler beim Stornieren der Session'
    }
  }
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return `${format(slot.start, 'HH:mm')} - ${format(slot.end, 'HH:mm')}`
}

/**
 * Get session type label
 */
export function getSessionTypeLabel(type: SessionType): string {
  const labels = {
    [SESSION_TYPES.ERSTGESPRAECH]: 'Erstgespräch',
    [SESSION_TYPES.FOLLOWUP]: 'Follow-up Session',
    [SESSION_TYPES.SUPPORT]: 'Support Session'
  }
  return labels[type] || type
}

/**
 * Get meeting type label
 */
export function getMeetingTypeLabel(type: MeetingType): string {
  const labels = {
    [MEETING_TYPES.ZOOM]: 'Zoom Video Call',
    [MEETING_TYPES.PHONE]: 'Telefon',
    [MEETING_TYPES.IN_PERSON]: 'Präsenz (vor Ort)'
  }
  return labels[type] || type
}
