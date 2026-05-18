// Timestamp replaced with Date
import { CourseType } from './index'

// Mentoring Session Types
export interface MentoringSession {
  id: string
  studentId: string
  instructorId: string
  courseId: string
  courseType: CourseType
  
  // Session Details
  title: string
  description?: string
  type: 'initial_consultation' | 'weekly_check_in' | 'progress_review' | 'final_review' | 'ad_hoc'
  week?: number // which course week this relates to
  
  // Scheduling
  scheduledStart: Date
  scheduledEnd: Date
  actualStart?: Date
  actualEnd?: Date
  timeZone: string
  
  // Status and Management
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  isRescheduled: boolean
  originalSessionId?: string // if this is a rescheduled session
  
  // Meeting Details
  meetingType: 'zoom' | 'google_meet' | 'phone' | 'in_person'
  meetingUrl?: string
  meetingId?: string
  meetingPassword?: string
  location?: string // for in-person meetings
  
  // Session Content
  agenda: string[]
  sessionNotes?: SessionNotes
  
  // Notifications
  remindersSent: {
    student24h: boolean
    student1h: boolean
    instructor24h: boolean
    instructor15min: boolean
  }
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string // admin/instructor uid
}

export interface SessionNotes {
  // Pre-session
  studentPrep?: string
  instructorPrep?: string
  
  // During session
  keyTopicsCovered: string[]
  questionsDiscussed: string[]
  challengesIdentified: string[]
  progressAssessment: {
    understanding: number // 1-5 scale
    implementation: number // 1-5 scale
    engagement: number // 1-5 scale
  }
  
  // Post-session
  actionItems: ActionItem[]
  nextWeekFocus: string[]
  resourcesShared: string[]
  followUpRequired: boolean
  followUpDetails?: string
  
  // Recording
  recordingUrl?: string
  recordingPassword?: string
  
  // Feedback
  studentFeedback?: {
    rating: number // 1-5 scale
    comments: string
    submittedAt: Date
  }
  
  instructorNotes: string
  privateNotes?: string // admin only notes
  
  createdAt: Date
  updatedAt: Date
}

export interface ActionItem {
  id: string
  description: string
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo: 'student' | 'instructor'
  completedAt?: Date
  completionNotes?: string
}

// Course Content for Mentoring
export interface MentoringCourseContent {
  id: string
  courseType: CourseType
  version: number
  
  // Content Structure
  modules: MentoringModule[]
  
  // Session Planning
  defaultSessionSchedule: SessionTemplate[]
  totalSessions: number
  courseDurationWeeks: number
  
  // Resources
  sharedResources: ContentResource[]
  
  // Assessment
  milestones: Milestone[]
  
  // Metadata
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface MentoringModule {
  id: string
  week: number
  title: string
  description: string
  
  // Learning Objectives
  objectives: string[]
  keyTopics: string[]
  
  // Pre-session Materials
  preworkRequired: boolean
  preworkInstructions?: string
  preworkResources: ContentResource[]
  
  // Session Content
  sessionTemplate: SessionTemplate
  
  // Post-session Materials
  followUpResources: ContentResource[]
  assignedTasks: string[]
  
  // Progress Tracking
  completionCriteria: string[]
  assessmentMethod: 'self_assessment' | 'instructor_review' | 'practical_demo' | 'quiz'
  
  isLocked: boolean
  unlockConditions: string[]
}

export interface SessionTemplate {
  title: string
  duration: number // minutes
  format: 'structured' | 'flexible' | 'workshop'
  
  agendaTemplate: {
    checkIn: number // minutes
    reviewProgress: number
    newContent: number
    practicalWork: number
    planning: number
    qAndA: number
  }
  
  requiredPrep: string[]
  suggestedQuestions: string[]
  commonChallenges: string[]
  resourcesNeeded: string[]
}

export interface ContentResource {
  id: string
  title: string
  description: string
  type: 'video' | 'pdf' | 'template' | 'worksheet' | 'tool' | 'external_link' | 'reading'
  url?: string
  fileUrl?: string
  content?: string // for text-based resources
  
  // Access Control
  accessLevel: 'all_students' | 'course_specific' | 'premium_only'
  requiredPlan?: 'pro' | 'max'
  
  // Organization
  category: string
  tags: string[]
  week?: number
  moduleId?: string
  
  // Usage Tracking
  downloads: number
  lastAccessed?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Milestone {
  id: string
  week: number
  title: string
  description: string
  type: 'knowledge' | 'practical' | 'project' | 'assessment'
  
  // Criteria
  completionRequirements: string[]
  assessmentCriteria: AssessmentCriteria[]
  
  // Timing
  isDueDate: boolean
  dueDate?: Date
  estimatedHours: number
  
  // Tracking
  isRequired: boolean
  weight: number // for overall course progress
}

export interface AssessmentCriteria {
  criterion: string
  weight: number
  passingScore: number
  scoringRubric: {
    [key: number]: string // score -> description
  }
}

// Student Progress for Mentoring
export interface MentoringProgress {
  id: string
  studentId: string
  courseId: string
  courseType: CourseType
  
  // Overall Progress
  currentWeek: number
  overallCompletion: number // percentage
  
  // Module Progress
  moduleProgress: {
    [moduleId: string]: {
      status: 'not_started' | 'in_progress' | 'completed'
      completionDate?: Date
      score?: number
      notes?: string
    }
  }
  
  // Session Attendance
  sessionsAttended: number
  sessionsScheduled: number
  attendanceRate: number
  
  // Performance Metrics
  averageEngagement: number
  averageUnderstanding: number
  averageImplementation: number
  
  // Goal Tracking
  initialGoals: string[]
  currentGoals: string[]
  achievedGoals: string[]
  
  // Action Items
  activeActionItems: string[] // action item IDs
  completedActionItems: string[]
  
  // Milestones
  milestoneProgress: {
    [milestoneId: string]: {
      status: 'not_started' | 'in_progress' | 'completed'
      score?: number
      feedback?: string
      completedAt?: Date
    }
  }
  
  // Next Steps
  nextSessionId?: string
  upcomingDeadlines: {
    actionItems: Array<{
      id: string
      description: string
      dueDate: Date
    }>
    milestones: Array<{
      id: string
      title: string
      dueDate: Date
    }>
  }
  
  // Metadata
  lastUpdated: Date
  updatedBy: string
}

// Calendar and Scheduling
export interface InstructorAvailability {
  instructorId: string
  timeZone: string
  
  // Regular availability
  weeklySchedule: {
    [dayOfWeek: number]: TimeSlot[] // 0-6 for Sun-Sat
  }
  
  // Exceptions
  unavailableDates: DateRange[]
  customAvailability: {
    [dateString: string]: TimeSlot[] // YYYY-MM-DD format
  }
  
  // Booking rules
  advanceBookingDays: number // minimum days in advance
  maxBookingDays: number // maximum days in advance
  bufferMinutes: number // buffer between sessions
  
  // Session limits
  maxSessionsPerDay: number
  maxSessionsPerWeek: number
  
  // Metadata
  updatedAt: Date
  updatedBy: string
}

export interface TimeSlot {
  start: string // HH:MM format
  end: string // HH:MM format
}

export interface DateRange {
  start: Date
  end: Date
  reason?: string
}

// Notifications for Mentoring
export interface MentoringNotification {
  id: string
  recipientId: string
  recipientRole: 'student' | 'instructor' | 'admin'
  
  type: 'session_reminder' | 'session_cancelled' | 'session_rescheduled' | 'action_item_due' | 'milestone_due' | 'progress_update'
  
  title: string
  message: string
  
  // Related entities
  sessionId?: string
  actionItemId?: string
  milestoneId?: string
  
  // Delivery
  channels: {
    email: boolean
    whatsapp: boolean
    inApp: boolean
  }
  
  // Status
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  
  // Scheduling
  scheduledFor: Date
  sentAt?: Date
  readAt?: Date
  
  // Metadata
  createdAt: Date
  updatedBy: string
}

// Collection names for mentoring
export const MENTORING_COLLECTIONS = {
  MENTORING_SESSIONS: 'mentoring_sessions',
  SESSION_NOTES: 'session_notes',
  COURSE_CONTENT: 'mentoring_course_content',
  CONTENT_RESOURCES: 'content_resources',
  MENTORING_PROGRESS: 'mentoring_progress',
  INSTRUCTOR_AVAILABILITY: 'instructor_availability',
  MENTORING_NOTIFICATIONS: 'mentoring_notifications',
} as const

export type MentoringCollectionName = typeof MENTORING_COLLECTIONS[keyof typeof MENTORING_COLLECTIONS]
