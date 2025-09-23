import { Timestamp } from 'firebase/firestore'

// Course Types
export type CourseType = 'ai' | 'dropshipping'

export type PlanType = 'pro' | 'max'

export interface Course {
  id: string
  type: CourseType
  title: string
  description: string
  price: {
    pro: number
    max: number
  }
  duration: number // weeks
  modules: CourseModule[]
  features: string[]
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CourseModule {
  id: string
  week: number
  title: string
  description: string
  topics: string[]
  videoUrl?: string
  resources: Resource[]
  isLocked: boolean
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'template'
  url: string
  description?: string
}

// User Types
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'student' | 'admin' | 'instructor'
  profile: UserProfile
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
}

export interface UserProfile {
  firstName?: string
  lastName?: string
  company?: string
  industry?: string
  experience?: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  timeZone?: string
  country?: string
  marketingConsent: boolean
  communicationPreferences: {
    email: boolean
    whatsapp: boolean
    discord: boolean
  }
}

// Enrollment Types
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  courseType: CourseType
  planType: PlanType
  status: 'active' | 'completed' | 'cancelled' | 'refunded'
  progress: CourseProgress
  purchaseDetails: {
    amount: number
    currency: string
    paymentMethod: string
    transactionId: string
    purchaseDate: Timestamp
  }
  accessDetails: {
    startDate: Timestamp
    expiryDate?: Timestamp // null for lifetime access
    whatsappAccess: boolean
    discordAccess: boolean
    mentoringSessionsRemaining?: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CourseProgress {
  currentWeek: number
  completedModules: string[] // module IDs
  totalProgress: number // percentage 0-100
  weeklyFeedback: WeeklyFeedback[]
  lastAccessedAt: Timestamp
}

export interface WeeklyFeedback {
  week: number
  submitted: boolean
  submittedAt?: Timestamp
  responses: {
    understanding: number // 1-5 scale
    implementation: number // 1-5 scale
    satisfaction: number // 1-5 scale
    challenges: string
    wins: string
    questions: string
    nextWeekGoals: string[]
  }
}

// Support Types
export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  category: 'technical' | 'course' | 'billing' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed'
  assignedTo?: string // admin/instructor uid
  messages: SupportMessage[]
  createdAt: Timestamp
  updatedAt: Timestamp
  resolvedAt?: Timestamp
}

export interface SupportMessage {
  id: string
  ticketId: string
  senderId: string
  senderRole: 'student' | 'admin' | 'instructor'
  message: string
  attachments?: string[]
  isInternal: boolean // internal notes for staff
  createdAt: Timestamp
}

// Community Types
export interface CommunityAccess {
  userId: string
  whatsappGroups: {
    ai?: {
      groupId: string
      inviteLink: string
      joinedAt?: Timestamp
    }
    dropshipping?: {
      groupId: string
      inviteLink: string
      joinedAt?: Timestamp
    }
  }
  discordAccess: {
    discordUserId?: string
    roles: string[]
    joinedAt?: Timestamp
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Payment Types
export interface Payment {
  id: string
  userId: string
  enrollmentId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'stripe' | 'paypal' | 'coinbase'
  providerPaymentId: string
  providerCustomerId?: string
  metadata: {
    courseType: CourseType
    planType: PlanType
    customerEmail: string
    customerName?: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
  completedAt?: Timestamp
  refundedAt?: Timestamp
}

// Intake Types (Pre-purchase questionnaire)
export interface IntakeResponse {
  id: string
  email: string
  responses: {
    // Personal Information
    firstName: string
    lastName: string
    company?: string
    industry?: string
    
    // Experience & Goals
    currentExperience: 'none' | 'beginner' | 'intermediate' | 'advanced'
    primaryGoal: string
    timeCommitment: 'part-time' | 'full-time' | 'weekends'
    budget: 'under-1k' | '1k-5k' | '5k-10k' | '10k-plus'
    
    // Course Specific
    interestedCourse: CourseType[]
    preferredPlan: PlanType
    
    // Motivation & Expectations
    motivation: string
    expectedOutcome: string
    challenges: string[]
    
    // Logistics
    timeZone: string
    country: string
    preferredLanguage: 'de' | 'en'
    
    // Marketing
    howDidYouHear: string
    marketingConsent: boolean
  }
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  reviewNotes?: string
  reviewedBy?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Analytics Types
export interface UserActivity {
  id: string
  userId: string
  action: 'login' | 'logout' | 'module_start' | 'module_complete' | 'feedback_submit' | 'support_ticket' | 'community_join'
  details: Record<string, any>
  metadata: {
    userAgent?: string
    ipAddress?: string
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  }
  createdAt: Timestamp
}

// Admin Types
export interface AdminSettings {
  id: 'global'
  courses: {
    ai: {
      isActive: boolean
      maxEnrollments?: number
      nextCohortStart?: Timestamp
    }
    dropshipping: {
      isActive: boolean
      maxEnrollments?: number
      nextCohortStart?: Timestamp
    }
  }
  community: {
    whatsapp: {
      ai: {
        groupId: string
        inviteLink: string
        isActive: boolean
      }
      dropshipping: {
        groupId: string
        inviteLink: string
        isActive: boolean
      }
    }
    discord: {
      serverId: string
      inviteLink: string
      isActive: boolean
    }
  }
  support: {
    businessHours: {
      start: string // "09:00"
      end: string // "17:00"
      timezone: string
      workingDays: number[] // [1,2,3,4,5] for Mon-Fri
    }
    autoResponder: {
      enabled: boolean
      message: string
    }
  }
  updatedAt: Timestamp
  updatedBy: string
}

// Email Types
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[] // placeholder variables
  category: 'welcome' | 'course' | 'support' | 'marketing' | 'system'
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface EmailLog {
  id: string
  templateId?: string
  userId?: string
  email: string
  subject: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  providerMessageId?: string
  metadata: Record<string, any>
  sentAt: Timestamp
  deliveredAt?: Timestamp
  openedAt?: Timestamp
  clickedAt?: Timestamp
}

// Utility Types
export type FirestoreTimestamp = Timestamp
export type DocumentId = string

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  SUPPORT_TICKETS: 'support_tickets',
  COMMUNITY_ACCESS: 'community_access',
  PAYMENTS: 'payments',
  INTAKE_RESPONSES: 'intake_responses',
  USER_ACTIVITY: 'user_activity',
  ADMIN_SETTINGS: 'admin_settings',
  EMAIL_TEMPLATES: 'email_templates',
  EMAIL_LOGS: 'email_logs',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]

// Re-export mentoring types
export * from './mentoring'
