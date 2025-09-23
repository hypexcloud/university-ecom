import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './config'
import {
  MentoringSession,
  MentoringProgress,
  MentoringCourseContent,
  ContentResource,
  InstructorAvailability,
  SessionNotes,
  MentoringNotification,
  MENTORING_COLLECTIONS,
  CourseType
} from '@/lib/types'

// Mentoring Session Management
export class MentoringSessionService {
  private static collection = MENTORING_COLLECTIONS.MENTORING_SESSIONS

  static async createSession(sessionData: Omit<MentoringSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...sessionData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating mentoring session:', error)
      throw error
    }
  }

  static async updateSession(sessionId: string, updates: Partial<MentoringSession>): Promise<void> {
    try {
      const sessionRef = doc(db, this.collection, sessionId)
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating mentoring session:', error)
      throw error
    }
  }

  static async getSession(sessionId: string): Promise<MentoringSession | null> {
    try {
      const sessionDoc = await getDoc(doc(db, this.collection, sessionId))
      if (sessionDoc.exists()) {
        return { id: sessionDoc.id, ...sessionDoc.data() } as MentoringSession
      }
      return null
    } catch (error) {
      console.error('Error getting mentoring session:', error)
      throw error
    }
  }

  static async getSessionsByStudent(studentId: string): Promise<MentoringSession[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('studentId', '==', studentId),
        orderBy('scheduledStart', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentoringSession[]
    } catch (error) {
      console.error('Error getting sessions for student:', error)
      throw error
    }
  }

  static async getSessionsByInstructor(instructorId: string): Promise<MentoringSession[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('instructorId', '==', instructorId),
        orderBy('scheduledStart', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentoringSession[]
    } catch (error) {
      console.error('Error getting sessions for instructor:', error)
      throw error
    }
  }

  static async getUpcomingSessions(limitCount?: number): Promise<MentoringSession[]> {
    try {
      const now = Timestamp.now()
      let q = query(
        collection(db, this.collection),
        where('scheduledStart', '>', now),
        where('status', 'in', ['scheduled', 'confirmed']),
        orderBy('scheduledStart', 'asc')
      )
      
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentoringSession[]
    } catch (error) {
      console.error('Error getting upcoming sessions:', error)
      throw error
    }
  }

  static async cancelSession(sessionId: string, reason?: string): Promise<void> {
    try {
      await this.updateSession(sessionId, {
        status: 'cancelled',
        // Store cancellation reason in session notes or separate field
      })
    } catch (error) {
      console.error('Error cancelling session:', error)
      throw error
    }
  }

  static async rescheduleSession(
    sessionId: string,
    newStartTime: Date,
    newEndTime: Date,
    reason?: string
  ): Promise<void> {
    try {
      const originalSession = await this.getSession(sessionId)
      if (!originalSession) throw new Error('Session not found')

      // Update the original session to mark as rescheduled
      await this.updateSession(sessionId, {
        status: 'cancelled',
        isRescheduled: true,
      })

      // Create new session with updated times
      await this.createSession({
        ...originalSession,
        scheduledStart: Timestamp.fromDate(newStartTime),
        scheduledEnd: Timestamp.fromDate(newEndTime),
        originalSessionId: sessionId,
        isRescheduled: false,
        status: 'scheduled',
        remindersSent: {
          student24h: false,
          student1h: false,
          instructor24h: false,
          instructor15min: false,
        },
      })
    } catch (error) {
      console.error('Error rescheduling session:', error)
      throw error
    }
  }

  static subscribeToSessions(
    filters: {
      studentId?: string
      instructorId?: string
      status?: MentoringSession['status']
    },
    callback: (sessions: MentoringSession[]) => void
  ): Unsubscribe {
    let q = collection(db, this.collection)

    const constraints = []
    if (filters.studentId) {
      constraints.push(where('studentId', '==', filters.studentId))
    }
    if (filters.instructorId) {
      constraints.push(where('instructorId', '==', filters.instructorId))
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status))
    }
    constraints.push(orderBy('scheduledStart', 'desc'))

    const queryRef = query(q, ...constraints)

    return onSnapshot(queryRef, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentoringSession[]
      callback(sessions)
    })
  }
}

// Session Notes Management
export class SessionNotesService {
  private static collection = MENTORING_COLLECTIONS.SESSION_NOTES

  static async createNotes(sessionId: string, notes: Omit<SessionNotes, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await addDoc(collection(db, this.collection), {
        sessionId,
        ...notes,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error creating session notes:', error)
      throw error
    }
  }

  static async updateNotes(sessionId: string, updates: Partial<SessionNotes>): Promise<void> {
    try {
      const q = query(
        collection(db, this.collection),
        where('sessionId', '==', sessionId)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const noteDoc = querySnapshot.docs[0]
        await updateDoc(noteDoc.ref, {
          ...updates,
          updatedAt: Timestamp.now(),
        })
      }
    } catch (error) {
      console.error('Error updating session notes:', error)
      throw error
    }
  }

  static async getNotes(sessionId: string): Promise<SessionNotes | null> {
    try {
      const q = query(
        collection(db, this.collection),
        where('sessionId', '==', sessionId)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const noteDoc = querySnapshot.docs[0]
        return noteDoc.data() as SessionNotes
      }
      return null
    } catch (error) {
      console.error('Error getting session notes:', error)
      throw error
    }
  }
}

// Course Content Management
export class MentoringContentService {
  private static collection = MENTORING_COLLECTIONS.COURSE_CONTENT

  static async createCourseContent(content: Omit<MentoringCourseContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...content,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating course content:', error)
      throw error
    }
  }

  static async updateCourseContent(contentId: string, updates: Partial<MentoringCourseContent>): Promise<void> {
    try {
      const contentRef = doc(db, this.collection, contentId)
      await updateDoc(contentRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating course content:', error)
      throw error
    }
  }

  static async getCourseContent(courseType: CourseType): Promise<MentoringCourseContent | null> {
    try {
      const q = query(
        collection(db, this.collection),
        where('courseType', '==', courseType),
        where('isActive', '==', true),
        orderBy('version', 'desc'),
        limit(1)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const contentDoc = querySnapshot.docs[0]
        return { id: contentDoc.id, ...contentDoc.data() } as MentoringCourseContent
      }
      return null
    } catch (error) {
      console.error('Error getting course content:', error)
      throw error
    }
  }
}

// Content Resources Management
export class ContentResourceService {
  private static collection = MENTORING_COLLECTIONS.CONTENT_RESOURCES

  static async createResource(resource: Omit<ContentResource, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'lastAccessed'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...resource,
        downloads: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating resource:', error)
      throw error
    }
  }

  static async getResourcesByModule(moduleId: string): Promise<ContentResource[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('moduleId', '==', moduleId),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentResource[]
    } catch (error) {
      console.error('Error getting resources for module:', error)
      throw error
    }
  }

  static async incrementDownloadCount(resourceId: string): Promise<void> {
    try {
      const resourceRef = doc(db, this.collection, resourceId)
      const resourceDoc = await getDoc(resourceRef)
      
      if (resourceDoc.exists()) {
        const currentDownloads = resourceDoc.data().downloads || 0
        await updateDoc(resourceRef, {
          downloads: currentDownloads + 1,
          lastAccessed: Timestamp.now(),
        })
      }
    } catch (error) {
      console.error('Error incrementing download count:', error)
      throw error
    }
  }
}

// Progress Tracking
export class MentoringProgressService {
  private static collection = MENTORING_COLLECTIONS.MENTORING_PROGRESS

  static async createProgress(progress: Omit<MentoringProgress, 'id' | 'lastUpdated'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...progress,
        lastUpdated: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating mentoring progress:', error)
      throw error
    }
  }

  static async updateProgress(studentId: string, courseId: string, updates: Partial<MentoringProgress>): Promise<void> {
    try {
      const q = query(
        collection(db, this.collection),
        where('studentId', '==', studentId),
        where('courseId', '==', courseId)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const progressDoc = querySnapshot.docs[0]
        await updateDoc(progressDoc.ref, {
          ...updates,
          lastUpdated: Timestamp.now(),
        })
      }
    } catch (error) {
      console.error('Error updating mentoring progress:', error)
      throw error
    }
  }

  static async getProgress(studentId: string, courseId: string): Promise<MentoringProgress | null> {
    try {
      const q = query(
        collection(db, this.collection),
        where('studentId', '==', studentId),
        where('courseId', '==', courseId)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const progressDoc = querySnapshot.docs[0]
        return { id: progressDoc.id, ...progressDoc.data() } as MentoringProgress
      }
      return null
    } catch (error) {
      console.error('Error getting mentoring progress:', error)
      throw error
    }
  }

  static async markModuleComplete(studentId: string, courseId: string, moduleId: string, score?: number): Promise<void> {
    try {
      const progress = await this.getProgress(studentId, courseId)
      if (progress) {
        const updatedModuleProgress = {
          ...progress.moduleProgress,
          [moduleId]: {
            status: 'completed' as const,
            completionDate: Timestamp.now(),
            score,
          }
        }

        await this.updateProgress(studentId, courseId, {
          moduleProgress: updatedModuleProgress,
        })
      }
    } catch (error) {
      console.error('Error marking module complete:', error)
      throw error
    }
  }
}

// Instructor Availability Management
export class InstructorAvailabilityService {
  private static collection = MENTORING_COLLECTIONS.INSTRUCTOR_AVAILABILITY

  static async setAvailability(availability: Omit<InstructorAvailability, 'updatedAt'>): Promise<void> {
    try {
      const availabilityRef = doc(db, this.collection, availability.instructorId)
      await updateDoc(availabilityRef, {
        ...availability,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error setting instructor availability:', error)
      throw error
    }
  }

  static async getAvailability(instructorId: string): Promise<InstructorAvailability | null> {
    try {
      const availabilityDoc = await getDoc(doc(db, this.collection, instructorId))
      if (availabilityDoc.exists()) {
        return availabilityDoc.data() as InstructorAvailability
      }
      return null
    } catch (error) {
      console.error('Error getting instructor availability:', error)
      throw error
    }
  }

  static async checkAvailability(
    instructorId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    try {
      // Get instructor availability
      const availability = await this.getAvailability(instructorId)
      if (!availability) return false

      // Check if the requested time slot conflicts with existing sessions
      const existingSessions = await MentoringSessionService.getSessionsByInstructor(instructorId)
      const conflictingSessions = existingSessions.filter(session => {
        const sessionStart = new Date(session.scheduledStart.seconds * 1000)
        const sessionEnd = new Date(session.scheduledEnd.seconds * 1000)
        
        return (
          session.status !== 'cancelled' &&
          ((startTime >= sessionStart && startTime < sessionEnd) ||
           (endTime > sessionStart && endTime <= sessionEnd) ||
           (startTime <= sessionStart && endTime >= sessionEnd))
        )
      })

      return conflictingSessions.length === 0
    } catch (error) {
      console.error('Error checking availability:', error)
      return false
    }
  }
}

// Notification Service
export class MentoringNotificationService {
  private static collection = MENTORING_COLLECTIONS.MENTORING_NOTIFICATIONS

  static async createNotification(notification: Omit<MentoringNotification, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collection), {
        ...notification,
        createdAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  static async scheduleSessionReminders(sessionId: string): Promise<void> {
    try {
      const session = await MentoringSessionService.getSession(sessionId)
      if (!session) return

      const sessionStart = new Date(session.scheduledStart.seconds * 1000)
      
      // Schedule 24-hour reminder
      const reminder24h = new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000)
      if (reminder24h > new Date()) {
        await this.createNotification({
          recipientId: session.studentId,
          recipientRole: 'student',
          type: 'session_reminder',
          title: 'Session Reminder - 24 Hours',
          message: `Your mentoring session "${session.title}" is scheduled for tomorrow at ${sessionStart.toLocaleTimeString()}.`,
          sessionId,
          channels: { email: true, whatsapp: true, inApp: true },
          status: 'pending',
          scheduledFor: Timestamp.fromDate(reminder24h),
          updatedBy: session.createdBy,
        })
      }

      // Schedule 1-hour reminder
      const reminder1h = new Date(sessionStart.getTime() - 60 * 60 * 1000)
      if (reminder1h > new Date()) {
        await this.createNotification({
          recipientId: session.studentId,
          recipientRole: 'student',
          type: 'session_reminder',
          title: 'Session Reminder - 1 Hour',
          message: `Your mentoring session "${session.title}" starts in 1 hour. Join here: ${session.meetingUrl}`,
          sessionId,
          channels: { email: true, whatsapp: false, inApp: true },
          status: 'pending',
          scheduledFor: Timestamp.fromDate(reminder1h),
          updatedBy: session.createdBy,
        })
      }
    } catch (error) {
      console.error('Error scheduling session reminders:', error)
      throw error
    }
  }

  static async getPendingNotifications(): Promise<MentoringNotification[]> {
    try {
      const now = Timestamp.now()
      const q = query(
        collection(db, this.collection),
        where('status', '==', 'pending'),
        where('scheduledFor', '<=', now),
        orderBy('scheduledFor', 'asc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentoringNotification[]
    } catch (error) {
      console.error('Error getting pending notifications:', error)
      throw error
    }
  }

  static async markNotificationSent(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, this.collection, notificationId)
      await updateDoc(notificationRef, {
        status: 'sent',
        sentAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error marking notification as sent:', error)
      throw error
    }
  }
}

// Utility functions
export const MentoringUtils = {
  /**
   * Calculate overall course progress for a student
   */
  calculateProgressPercentage(progress: MentoringProgress): number {
    const moduleIds = Object.keys(progress.moduleProgress)
    if (moduleIds.length === 0) return 0

    const completedModules = moduleIds.filter(
      moduleId => progress.moduleProgress[moduleId].status === 'completed'
    ).length

    return Math.round((completedModules / moduleIds.length) * 100)
  },

  /**
   * Get next upcoming session for a student
   */
  async getNextSession(studentId: string): Promise<MentoringSession | null> {
    try {
      const sessions = await MentoringSessionService.getSessionsByStudent(studentId)
      const upcomingSessions = sessions.filter(session => {
        const sessionStart = new Date(session.scheduledStart.seconds * 1000)
        return sessionStart > new Date() && ['scheduled', 'confirmed'].includes(session.status)
      })

      if (upcomingSessions.length === 0) return null

      // Sort by scheduled start time and return the earliest
      upcomingSessions.sort((a, b) => {
        const aStart = new Date(a.scheduledStart.seconds * 1000)
        const bStart = new Date(b.scheduledStart.seconds * 1000)
        return aStart.getTime() - bStart.getTime()
      })

      return upcomingSessions[0]
    } catch (error) {
      console.error('Error getting next session:', error)
      return null
    }
  },

  /**
   * Format session duration in minutes
   */
  getSessionDuration(session: MentoringSession): number {
    const start = new Date(session.scheduledStart.seconds * 1000)
    const end = new Date(session.scheduledEnd.seconds * 1000)
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60))
  },

  /**
   * Check if session is within the next 24 hours
   */
  isSessionSoon(session: MentoringSession): boolean {
    const sessionStart = new Date(session.scheduledStart.seconds * 1000)
    const now = new Date()
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    return sessionStart >= now && sessionStart <= twentyFourHoursFromNow
  },
}
