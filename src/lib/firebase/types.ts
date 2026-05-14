// Course data types matching Firestore structure
export type PlanType = 'fast' | 'business' | 'infinity'

export type CourseLevel = 'Anfänger' | 'Fortgeschritten' | 'Experte'

export interface CourseModule {
  id: string
  moduleNumber: number
  title: string
  description: string
  duration: string // e.g., "30 min"
  videoUrl?: string
  resources?: {
    id: string
    title: string
    type: 'pdf' | 'video' | 'link' | 'document'
    url: string
  }[]
  quiz?: {
    id: string
    questions: number
    passingScore: number
  }
  isCompleted?: boolean
  completedAt?: Date
}

export interface CourseWeek {
  weekNumber: number
  title: string
  description: string
  modules: string[] // Array of module IDs
  duration: string // e.g., "3 Stunden"
  isCompleted?: boolean
}

export interface Course {
  id: string
  courseId: string
  title: string
  description: string
  thumbnail: string
  category: string
  level: CourseLevel
  duration: string // e.g., "3 Monate"
  estimatedHours: number
  totalModules: number
  totalVideos: number
  totalResources: number
  totalQuizzes: number
  rating: number
  studentsEnrolled: number
  certificateAvailable: boolean
  
  // Learning objectives
  learningObjectives: string[]
  
  // Course structure
  weeks: CourseWeek[]
  modules: CourseModule[]
  
  // Pricing (for reference)
  pricing?: {
    fast: number
    business: number
    infinity: number
  }
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  planType: PlanType
  planDisplayName: string
  
  // Progress tracking
  progress: number // 0-100
  completedModules: number
  currentWeek: number
  lastAccessedModuleId?: string
  
  // For Business/Infinity plans
  completedSessions?: number
  totalSessions?: number
  nextSessionDate?: Date
  mentorId?: string
  mentorName?: string
  
  // Dates
  enrolledDate: Date
  lastAccessed?: Date
  estimatedCompletionDate?: Date
  completedAt?: Date
  
  // Status
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  
  // Module completion tracking
  completedModuleIds: string[]
  moduleProgress: {
    [moduleId: string]: {
      completed: boolean
      completedAt?: Date
      videoProgress?: number // percentage
      quizScore?: number
    }
  }
}

export interface Session {
  id: string
  enrollmentId: string
  userId: string
  courseId: string
  mentorId: string
  
  // Session details
  sessionNumber: number
  title: string
  description?: string
  date: Date
  duration: number // minutes
  
  // Status
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  
  // Meeting details
  meetingLink?: string
  notes?: string
  
  // Unlocks
  unlocksModuleIds?: string[] // Modules that get unlocked after this session
  
  createdAt: Date
  updatedAt: Date
}
