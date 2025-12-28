/**
 * Intake Form Types
 * 
 * Type definitions for pre-purchase qualification system
 */

import { Timestamp } from 'firebase/firestore'

export interface IntakeSubmission {
  id: string
  userId?: string // If logged in
  email: string
  
  // Personal Info
  firstName: string
  lastName: string
  phone?: string
  country: string
  
  // Business Background
  currentSituation: 'employed' | 'self_employed' | 'student' | 'unemployed' | 'other'
  hasOnlineBusiness: boolean
  businessExperience: 'none' | 'less_than_1_year' | '1_3_years' | 'more_than_3_years'
  monthlyRevenue?: string
  
  // Course Interest
  courseType: 'ai' | 'dropshipping' | 'both'
  primaryGoal: string // Free text
  timeCommitment: 'less_than_5h' | '5_10h' | '10_20h' | 'more_than_20h' // per week
  
  // AI Course Specific (if interested)
  aiExperience?: 'none' | 'beginner' | 'intermediate' | 'advanced'
  aiUseCase?: string // What they want to automate
  
  // Dropshipping Specific (if interested)
  dropshippingExperience?: 'none' | 'tried_failed' | 'currently_running' | 'experienced'
  targetMarket?: string
  
  // Qualification Questions
  investmentBudget: 'under_500' | '500_2000' | '2000_5000' | 'over_5000'
  readyToStart: 'immediately' | 'within_1_month' | 'within_3_months' | 'just_exploring'
  
  // Motivation & Commitment
  whyNow: string // Why are they looking for this now
  biggestChallenge: string
  expectations: string
  
  // Lead Scoring
  leadScore: number // 0-100
  qualification: 'high' | 'medium' | 'low'
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'reviewing'
  reviewedBy?: string
  reviewedAt?: Timestamp
  reviewNotes?: string
  
  // Metadata
  source?: string // Where they came from
  utmParams?: Record<string, string>
  submittedAt: Timestamp
  
  // Follow-up
  contacted?: boolean
  contactedAt?: Timestamp
  convertedToPurchase?: boolean
  purchaseDate?: Timestamp
  orderId?: string
}

export interface LeadScoringCriteria {
  // Business readiness (0-30 points)
  hasOnlineBusiness: number // 15 points
  businessExperience: number // 15 points
  
  // Financial readiness (0-25 points)
  investmentBudget: number // 15 points
  monthlyRevenue: number // 10 points
  
  // Commitment level (0-25 points)
  timeCommitment: number // 15 points
  readyToStart: number // 10 points
  
  // Fit & motivation (0-20 points)
  courseAlignment: number // 10 points
  clearGoals: number // 10 points
}

export const SCORING_WEIGHTS = {
  // Business Background
  hasOnlineBusiness: 15,
  businessExperience: {
    'none': 0,
    'less_than_1_year': 5,
    '1_3_years': 10,
    'more_than_3_years': 15,
  },
  
  // Financial Readiness
  investmentBudget: {
    'under_500': 0,
    '500_2000': 5,
    '2000_5000': 10,
    'over_5000': 15,
  },
  monthlyRevenue: {
    'none': 0,
    'under_1000': 2,
    '1000_5000': 5,
    '5000_10000': 8,
    'over_10000': 10,
  },
  
  // Commitment
  timeCommitment: {
    'less_than_5h': 0,
    '5_10h': 5,
    '10_20h': 10,
    'more_than_20h': 15,
  },
  readyToStart: {
    'just_exploring': 0,
    'within_3_months': 3,
    'within_1_month': 7,
    'immediately': 10,
  },
  
  // Fit
  clearGoals: 10, // If primaryGoal is detailed (>50 chars)
  relevantExperience: 10, // If has relevant experience
}
