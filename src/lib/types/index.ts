// All Date fields are now Date (Drizzle timestamptz maps to JS Date)

// ==========================================
// NEW ROLE SYSTEM (Phase 1 Update)
// ==========================================
export type UserRole = 'besucher' | 'kunde' | 'affiliate' | 'admin'

// Legacy role support for migration
export type LegacyRole = 'student' | 'instructor' | 'mentor' | 'teilnehmer'

// Course Types - Updated for new structure
export type CourseType = 'ai' | 'dropshipping' | 'creator-tiktok' | 'creator-youtube'

export type PlanType = 'fast' | 'business' | 'infinity'

// ==========================================
// USER TYPES (UPDATED)
// ==========================================
export interface User {
  uid: string
  email: string
  
  // New required fields
  role: UserRole
  firstName: string
  lastName: string
  
  // Optional contact
  phone?: string
  discord?: string
  
  // Optional profile
  displayName?: string
  photoURL?: string
  address?: Address
  birthDate?: Date
  
  // Role-specific data
  kundeData?: KundeData
  affiliateData?: AffiliateData
  
  // Attribution & tracking
  leadSource?: LeadSource
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  
  // Migration support
  version: number
  _legacy_role?: LegacyRole
  _legacy_name?: string
  
  // Legacy fields (kept for backward compatibility)
  profile?: UserProfile
}

export interface Address {
  street: string
  zipCode: string
  city: string
  country: string
}

export interface KundeData {
  enrolledCourses: string[] // courseEnrollment IDs
  totalSpent: number
  lastPurchaseDate?: Date
  preferences?: {
    language: 'de' | 'en'
    notifications: {
      email: boolean
      whatsapp: boolean
      discord: boolean
    }
  }
}

export interface AffiliateData {
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'banned'
  applicationDate: Date
  approvalDate?: Date
  testScore?: number
  testDate?: Date
  level: 'neuling' | 'experte' | 'master' | 'prestige'
  commissionRate: number
  stats: {
    invitedLeads: number
    convertedLeads: number
    activeLeads: number
    totalEarnings: number
    paidEarnings: number
    pendingEarnings: number
  }
}

export interface LeadSource {
  type: 'google' | 'youtube' | 'social_media' | 'creator' | 'direct'
  affiliateId?: string
  timestamp: Date
  details?: string
}

// Legacy User Profile (kept for backward compatibility)
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

// ==========================================
// COURSE TYPES (UPDATED FOR V2)
// ==========================================
export interface Course {
  id: string
  type: CourseType
  name: string
  nameDE: string
  description: string
  descriptionDE: string
  duration: number // days: 60, 90, or 30
  isActive: boolean
  
  modules: CourseModule[]
  plans: CoursePlan[]
  
  // Marketing
  features: string[]
  featuresDE: string[]
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface CoursePlan {
  id: string
  name: PlanType
  nameDE: string
  displayName: string
  displayNameDE: string
  price: number
  currency: 'EUR'
  features: string[]
  featuresDE: string[]
  includes1to1: boolean
  maxSlots?: number
  mentorId?: string
  description?: string
  descriptionDE?: string
}

export interface CourseModule {
  id: string
  order: number
  week?: number
  title: string
  titleDE?: string
  description: string
  descriptionDE?: string
  durationWeeks?: number
  topics: string[]
  resources: Resource[]
  videoUrl?: string
  isLocked: boolean
}

export interface Resource {
  id: string
  title: string
  titleDE?: string
  type: 'pdf' | 'video' | 'link' | 'template'
  url: string
  description?: string
  descriptionDE?: string
}

// ==========================================
// ENROLLMENT TYPES
// ==========================================
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  courseType: CourseType
  planType: PlanType
  orderId: string
  
  status: 'active' | 'completed' | 'cancelled' | 'refunded'
  progress: CourseProgress
  
  // Dates
  startDate: Date
  endDate: Date
  completionDate?: Date
  
  // For plans with 1:1
  mentorId?: string
  scheduledSessions?: number
  completedSessions?: number
  
  purchaseDetails: {
    amount: number
    currency: string
    paymentMethod: string
    transactionId: string
    purchaseDate: Date
  }
  
  accessDetails: {
    expiryDate?: Date
    whatsappAccess: boolean
    discordAccess: boolean
    mentoringSessionsRemaining?: number
  }
  
  createdAt: Date
  updatedAt: Date
}

export interface CourseProgress {
  currentWeek: number
  currentModule?: number
  completedModules: string[]
  totalProgress: number // 0-100
  weeklyFeedback?: WeeklyFeedback[]
  lastAccessedAt: Date
}

export interface WeeklyFeedback {
  week: number
  submitted: boolean
  submittedAt?: Date
  responses: {
    understanding: number
    implementation: number
    satisfaction: number
    challenges: string
    wins: string
    questions: string
    nextWeekGoals: string[]
  }
}

// ==========================================
// AFFILIATE SYSTEM (NEW)
// ==========================================
export interface Affiliate {
  userId: string
  
  // Application
  applicationData: {
    socialMedia: SocialMediaHandle[]
    motivation?: string
    applicationDate: Date
  }
  
  // Status
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'banned'
  approvalDate?: Date
  suspensionReason?: string
  
  // Test
  testScore?: number
  testDate?: Date
  testPassed: boolean
  
  // Level & Commission
  level: 'neuling' | 'experte' | 'master' | 'prestige'
  commissionRate: number
  
  // Stats
  stats: {
    invitedLeads: number
    convertedLeads: number
    activeLeads: number
    totalEarnings: number
    paidEarnings: number
    pendingEarnings: number
    currentMonthInvitations: number
    currentWeekInvitations: number
  }
  
  // Payout
  payoutMethod: 'paypal' | 'bank'
  payoutDetails: PayoutDetails
  
  // Achievements
  badges: ('gold' | 'diamond' | 'prestige')[]
  monthlyRank?: number
  
  // Permissions
  canSelfClose: boolean
  
  createdAt: Date
  updatedAt: Date
}

export interface SocialMediaHandle {
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'linkedin' | 'xing' | 'telegram' | 'discord'
  handle: string
  url?: string
}

export interface PayoutDetails {
  paypal?: {
    email: string
  }
  bank?: {
    accountHolder: string
    iban: string
    bic?: string
    bankName: string
  }
}

export interface Lead {
  id: string
  userId: string
  affiliateId?: string
  
  source: 'google' | 'youtube' | 'social_media' | 'creator' | 'direct'
  sourceDetail?: string
  
  status: 'invited' | 'contacted' | 'converted' | 'lost'
  
  // Journey
  invitedAt: Date
  contactedAt?: Date
  convertedAt?: Date
  lostAt?: Date
  
  // Conversion
  orderId?: string
  conversionValue?: number
  commissionAmount?: number
  commissionPaid: boolean
  
  // Erstgespräch
  erstgespraechBooked: boolean
  erstgespraechDate?: Date
  erstgespraechCompleted: boolean
  
  notes?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface Payout {
  id: string
  affiliateId: string
  
  // Period
  periodStart: Date
  periodEnd: Date
  month: string
  
  // Amount
  totalEarnings: number
  previousBalance: number
  amount: number
  
  // Method
  method: 'paypal' | 'bank'
  payoutDetails: PayoutDetails
  
  // Status
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed'
  approvedBy?: string
  approvedAt?: Date
  transactionId?: string
  completedAt?: Date
  
  // Reference
  includedLeads: string[]
  notes?: string
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// ORDER & PAYMENT TYPES (NEW)
// ==========================================
export interface Order {
  id: string
  orderNumber: string
  userId: string
  
  // Products
  items: OrderItem[]
  
  // Pricing
  subtotal: number
  tax: number
  total: number
  currency: 'EUR'
  
  // Payment
  paymentMethod: 'stripe' | 'paypal' | 'crypto' | 'invoice'
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  paymentId?: string
  
  // Invoice
  invoiceGenerated: boolean
  invoiceUrl?: string
  invoiceNumber?: string
  
  // Billing
  billingAddress: Address
  
  // Attribution
  affiliateId?: string
  leadId?: string
  commissionDue: number
  commissionRate: number
  commissionPaid: boolean
  
  // Erstgespräch
  erstgespraechRequested: boolean
  erstgespraechAppointmentId?: string
  
  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  
  // Fulfillment
  courseEnrollmentId?: string
  accessGranted: boolean
  accessGrantedAt?: Date
  
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  type: 'course' | 'creator-program'
  courseId: string
  planId: string
  name: string
  quantity: number
  price: number
}

export interface Payment {
  id: string
  userId: string
  orderId: string
  enrollmentId?: string
  
  amount: number
  currency: string
  
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'stripe' | 'paypal' | 'coinbase' | 'crypto' | 'invoice'
  
  providerPaymentId: string
  providerCustomerId?: string
  
  metadata: {
    courseType: CourseType
    planType: PlanType
    customerEmail: string
    customerName?: string
  }
  
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  refundedAt?: Date
}

// ==========================================
// SUPPORT TYPES
// ==========================================
export interface SupportTicket {
  id: string
  userId: string
  subject: string
  description: string
  category: 'technical' | 'course' | 'billing' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed'
  assignedTo?: string
  messages: SupportMessage[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export interface SupportMessage {
  id: string
  ticketId: string
  senderId: string
  senderRole: UserRole
  message: string
  attachments?: string[]
  isInternal: boolean
  createdAt: Date
}

// ==========================================
// INTAKE TYPES
// ==========================================
export interface IntakeResponse {
  id: string
  email: string
  responses: {
    firstName: string
    lastName: string
    company?: string
    industry?: string
    currentExperience: 'none' | 'beginner' | 'intermediate' | 'advanced'
    primaryGoal: string
    timeCommitment: 'part-time' | 'full-time' | 'weekends'
    budget: 'under-1k' | '1k-5k' | '5k-10k' | '10k-plus'
    interestedCourse: CourseType[]
    preferredPlan: PlanType
    motivation: string
    expectedOutcome: string
    challenges: string[]
    timeZone: string
    country: string
    preferredLanguage: 'de' | 'en'
    howDidYouHear: string
    marketingConsent: boolean
  }
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  reviewNotes?: string
  reviewedBy?: string
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// COMMUNITY TYPES
// ==========================================
export interface CommunityAccess {
  userId: string
  whatsappGroups: {
    ai?: {
      groupId: string
      inviteLink: string
      joinedAt?: Date
    }
    dropshipping?: {
      groupId: string
      inviteLink: string
      joinedAt?: Date
    }
  }
  discordAccess: {
    discordUserId?: string
    roles: string[]
    joinedAt?: Date
  }
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// ANALYTICS & ADMIN TYPES
// ==========================================
export interface UserActivity {
  id: string
  userId: string
  action: 'login' | 'logout' | 'module_start' | 'module_complete' | 'feedback_submit' | 'support_ticket' | 'community_join' | 'purchase' | 'affiliate_apply'
  details: Record<string, any>
  metadata: {
    userAgent?: string
    ipAddress?: string
    deviceType?: 'desktop' | 'mobile' | 'tablet'
  }
  createdAt: Date
}

export interface AdminSettings {
  id: 'global'
  courses: {
    ai: {
      isActive: boolean
      maxEnrollments?: number
      nextCohortStart?: Date
    }
    dropshipping: {
      isActive: boolean
      maxEnrollments?: number
      nextCohortStart?: Date
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
      start: string
      end: string
      timezone: string
      workingDays: number[]
    }
    autoResponder: {
      enabled: boolean
      message: string
    }
  }
  updatedAt: Date
  updatedBy: string
}

// ==========================================
// EMAIL TYPES
// ==========================================
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'welcome' | 'course' | 'support' | 'marketing' | 'system' | 'affiliate'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
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
  sentAt: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
}

// ==========================================
// UTILITY TYPES
// ==========================================
export type DocumentId = string
