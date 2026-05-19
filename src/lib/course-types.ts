/**
 * Course Content Types
 * 
 * Type definitions for course modules, lessons, and resources
 */

// Timestamp replaced with Date

export interface CourseModule {
  id: string
  courseId: string
  courseType: 'ai' | 'dropshipping'
  week: number
  title: string
  description: string
  order: number
  status: 'draft' | 'published'
  
  // Content
  objectives: string[]
  duration: string // e.g., "2 hours"
  
  // Prerequisites
  requiresPreviousModule: boolean
  unlockConditions?: {
    previousModulesCompleted?: string[]
    sessionCompleted?: boolean
  }
  
  // Session Integration
  hasSession: boolean
  sessionRequired: boolean
  sessionDate?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
  publishedAt?: Date
}

export interface CourseResource {
  id: string
  moduleId: string
  title: string
  description?: string
  type: 'video' | 'pdf' | 'link' | 'template' | 'document' | 'quiz'
  order: number
  
  // Resource location
  url?: string // For external links or Supabase Storage URLs
  videoUrl?: string // YouTube, Vimeo, or custom
  videoProvider?: 'youtube' | 'vimeo' | 'custom'
  fileUrl?: string // Supabase Storage URL
  fileName?: string
  fileSize?: number
  
  // Video-specific
  duration?: string // e.g., "15:30"
  thumbnailUrl?: string
  
  // Access control
  isRequired: boolean
  estimatedTime?: string // e.g., "30 minutes"
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface StudentProgress {
  id: string
  userId: string
  enrollmentId: string
  courseId: string
  courseType: 'ai' | 'dropshipping'
  
  // Overall Progress
  overallCompletion: number // 0-100
  currentWeek: number
  currentModuleId?: string
  
  // Module Progress
  modulesCompleted: string[] // Array of module IDs
  modulesInProgress: string[] // Array of module IDs
  modulesUnlocked: string[] // Array of module IDs
  
  // Resource Progress
  resourcesCompleted: string[] // Array of resource IDs
  videosWatched: {
    resourceId: string
    watchedSeconds: number
    totalSeconds: number
    completed: boolean
    lastWatchedAt: Date
  }[]
  
  // Session Progress
  sessionsCompleted: number
  totalSessions: number
  nextSessionDate?: Date
  
  // Quiz/Assessment
  quizzesCompleted: string[]
  quizScores: {
    quizId: string
    score: number
    maxScore: number
    completedAt: Date
  }[]
  
  // Milestones
  startedAt: Date
  lastAccessedAt: Date
  estimatedCompletionDate?: Date
  completedAt?: Date
  certificateIssued?: boolean
  certificateIssuedAt?: Date
  
  // Metadata
  updatedAt: Date
}

export interface Quiz {
  id: string
  moduleId: string
  title: string
  description: string
  type: 'quiz' | 'assessment' | 'final_exam'
  
  // Configuration
  passingScore: number // Percentage
  timeLimit?: number // Minutes
  attemptsAllowed: number
  randomizeQuestions: boolean
  showResults: boolean
  
  // Questions
  questions: QuizQuestion[]
  
  // Metadata
  isRequired: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  question: string
  explanation?: string
  points: number
  
  // Multiple choice
  options?: string[]
  correctAnswer?: number | string // Index or value
  
  // True/False
  correctBoolean?: boolean
  
  // Order
  order: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  enrollmentId: string
  
  // Attempt Info
  attemptNumber: number
  startedAt: Date
  submittedAt?: Date
  timeSpent: number // Seconds
  
  // Results
  score: number
  maxScore: number
  passed: boolean
  answers: {
    questionId: string
    answer: string | number | boolean
    correct: boolean
    points: number
  }[]
  
  // Feedback
  feedback?: string
}

export interface Certificate {
  id: string
  userId: string
  enrollmentId: string
  courseId: string
  courseType: 'ai' | 'dropshipping'
  
  // Certificate Info
  certificateNumber: string
  studentName: string
  courseName: string
  completionDate: Date
  issuedDate: Date
  
  // Achievement
  finalScore?: number
  overallCompletion: number
  sessionsCompleted: number
  
  // Certificate File
  pdfUrl?: string
  certificateImageUrl?: string
  
  // Verification
  verificationCode: string
  isVerified: boolean
  
  // Metadata
  createdAt: Date
}

export interface CourseTemplate {
  id: string
  courseType: 'ai' | 'dropshipping'
  name: string
  description: string
  
  // Structure
  totalWeeks: number
  totalSessions: number
  recommendedDuration: string
  
  // Default Modules (template for new enrollments)
  moduleTemplates: {
    week: number
    title: string
    description: string
    objectives: string[]
    hasSession: boolean
  }[]
  
  // Metadata
  isActive: boolean
  version: string
  createdAt: Date
  updatedAt: Date
}
