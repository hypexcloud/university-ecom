/**
 * Lead Scoring Utilities
 * 
 * Functions for calculating and managing lead scores
 */

import { SCORING_WEIGHTS } from './intake-types'
import type { IntakeSubmission } from './intake-types'

/**
 * Calculate lead score based on intake submission
 */
export function calculateLeadScore(submission: Partial<IntakeSubmission>): number {
  let score = 0

  // Business Background (0-30 points)
  if (submission.hasOnlineBusiness) {
    score += SCORING_WEIGHTS.hasOnlineBusiness
  }

  if (submission.businessExperience) {
    score += SCORING_WEIGHTS.businessExperience[submission.businessExperience]
  }

  // Financial Readiness (0-25 points)
  if (submission.investmentBudget) {
    score += SCORING_WEIGHTS.investmentBudget[submission.investmentBudget]
  }

  // Add revenue score if applicable
  if (submission.monthlyRevenue) {
    const revenueCategory = categorizeRevenue(submission.monthlyRevenue)
    score += SCORING_WEIGHTS.monthlyRevenue[revenueCategory]
  }

  // Commitment Level (0-25 points)
  if (submission.timeCommitment) {
    score += SCORING_WEIGHTS.timeCommitment[submission.timeCommitment]
  }

  if (submission.readyToStart) {
    score += SCORING_WEIGHTS.readyToStart[submission.readyToStart]
  }

  // Fit & Motivation (0-20 points)
  if (submission.primaryGoal && submission.primaryGoal.length > 50) {
    score += SCORING_WEIGHTS.clearGoals
  }

  // Check for relevant experience
  if (submission.courseType === 'ai' && submission.aiExperience && submission.aiExperience !== 'none') {
    score += SCORING_WEIGHTS.relevantExperience
  } else if (
    submission.courseType === 'dropshipping' &&
    submission.dropshippingExperience &&
    submission.dropshippingExperience !== 'none'
  ) {
    score += SCORING_WEIGHTS.relevantExperience
  } else if (submission.courseType === 'both') {
    // Give partial points if interested in both
    score += SCORING_WEIGHTS.relevantExperience / 2
  }

  return Math.min(score, 100) // Cap at 100
}

/**
 * Categorize monthly revenue
 */
function categorizeRevenue(
  revenue: string
): 'none' | 'under_1000' | '1000_5000' | '5000_10000' | 'over_10000' {
  const amount = parseFloat(revenue.replace(/[^0-9.]/g, ''))

  if (amount === 0 || isNaN(amount)) return 'none'
  if (amount < 1000) return 'under_1000'
  if (amount < 5000) return '1000_5000'
  if (amount < 10000) return '5000_10000'
  return 'over_10000'
}

/**
 * Determine qualification level based on score
 */
export function getQualificationLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

/**
 * Generate recommendation based on qualification
 */
export function getRecommendation(
  qualification: 'high' | 'medium' | 'low'
): {
  canPurchase: boolean
  message: string
  nextSteps: string[]
} {
  switch (qualification) {
    case 'high':
      return {
        canPurchase: true,
        message:
          'Perfekt! Sie erfüllen alle Kriterien für eine erfolgreiche Kursteilnahme. Sie können direkt zur Kursauswahl fortfahren.',
        nextSteps: [
          'Wählen Sie Ihr gewünschtes Kurspaket',
          'Schließen Sie die Zahlung ab',
          'Erhalten Sie sofortigen Zugang',
          'Buchen Sie Ihre erste Mentoring-Session',
        ],
      }

    case 'medium':
      return {
        canPurchase: true,
        message:
          'Gut! Sie haben ein solides Fundament. Wir empfehlen ein Beratungsgespräch, um sicherzustellen, dass der Kurs optimal zu Ihren Zielen passt.',
        nextSteps: [
          'Buchen Sie ein kostenloses Beratungsgespräch',
          'Klären Sie offene Fragen mit unserem Team',
          'Erhalten Sie eine personalisierte Empfehlung',
          'Starten Sie bei Bedarf direkt',
        ],
      }

    case 'low':
      return {
        canPurchase: false,
        message:
          'Vielen Dank für Ihr Interesse! Um den größtmöglichen Erfolg zu gewährleisten, empfehlen wir zunächst ein persönliches Gespräch mit unserem Team.',
        nextSteps: [
          'Buchen Sie ein kostenloses Beratungsgespräch',
          'Besprechen Sie Ihre individuellen Voraussetzungen',
          'Erhalten Sie maßgeschneiderte Vorbereitungstipps',
          'Entscheiden Sie dann über die Kursteilnahme',
        ],
      }
  }
}

/**
 * Check if submission meets minimum requirements
 */
export function meetsMinimumRequirements(submission: Partial<IntakeSubmission>): {
  meets: boolean
  missingFields: string[]
} {
  const required = [
    'firstName',
    'lastName',
    'email',
    'country',
    'currentSituation',
    'hasOnlineBusiness',
    'businessExperience',
    'courseType',
    'primaryGoal',
    'timeCommitment',
    'investmentBudget',
    'readyToStart',
    'whyNow',
    'biggestChallenge',
    'expectations',
  ]

  const missingFields = required.filter((field) => !submission[field as keyof IntakeSubmission])

  return {
    meets: missingFields.length === 0,
    missingFields,
  }
}
