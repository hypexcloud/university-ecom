/**
 * Stripe Configuration and Utilities
 * 
 * This file contains all Stripe-related configuration and helper functions
 * for payment processing in University Ecom.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js'

// Client-side Stripe instance (singleton)
let stripePromise: Promise<Stripe | null>

/**
 * Get Stripe instance for client-side use
 * Uses singleton pattern to avoid multiple instances
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
      return Promise.resolve(null)
    }
    
    stripePromise = loadStripe(publishableKey)
  }
  
  return stripePromise
}

/**
 * Course and Plan Pricing Configuration
 * Matches the requirements document pricing structure
 */
export const COURSE_PRICING = {
  ai: {
    name: 'AI Automatisierung Kurs',
    duration: 90, // 3 months in days
    plans: {
      fast: {
        name: 'Fast Plan',
        price: 200,
        currency: 'EUR',
        features: [
          'Zugang zu allen Kursinhalten',
          'WhatsApp Gruppe',
          'Discord Zugang',
          'Selbststudium'
        ],
        includes1to1: false
      },
      business: {
        name: 'Business Plan',
        price: 1000,
        currency: 'EUR',
        features: [
          'Alle Fast Plan Features',
          '3 x 1:1 Sessions mit Amin',
          'Persönliche Betreuung',
          'Prioritäts-Support'
        ],
        includes1to1: true,
        sessionCount: 3
      },
      infinity: {
        name: 'Infinity Plan',
        price: 1400,
        currency: 'EUR',
        features: [
          'Alle Business Plan Features',
          'Unbegrenzte 1:1 Sessions',
          'VIP Support',
          'Lifetime Updates'
        ],
        includes1to1: true,
        sessionCount: Infinity
      }
    }
  },
  dropshipping: {
    name: 'EU Dropshipping Kurs',
    duration: 60, // 2 months in days
    plans: {
      fast: {
        name: 'Fast Plan',
        price: 200,
        currency: 'EUR',
        features: [
          'Zugang zu allen Kursinhalten',
          'WhatsApp Gruppe',
          'Discord Zugang',
          'Selbststudium'
        ],
        includes1to1: false
      },
      business: {
        name: 'Business Plan',
        price: 1000,
        currency: 'EUR',
        features: [
          'Alle Fast Plan Features',
          '3 x 1:1 Sessions mit Esat',
          'Persönliche Betreuung',
          'Prioritäts-Support'
        ],
        includes1to1: true,
        sessionCount: 3
      },
      infinity: {
        name: 'Infinity Plan',
        price: 3000,
        currency: 'EUR',
        features: [
          'Alle Business Plan Features',
          'Unbegrenzte 1:1 Sessions',
          'VIP Support',
          'Lifetime Updates'
        ],
        includes1to1: true,
        sessionCount: Infinity
      }
    }
  },
  'tiktok-creator': {
    name: 'TikTok Creator Programm',
    duration: 30,
    plans: {
      tiktok: {
        name: 'TikTok Creator',
        price: 75,
        currency: 'EUR',
        features: [
          'Persönliches Briefing',
          '2 x 1:1 Coaching-Calls',
          'TikTok-spezifische Strategie',
          'Content-Analyse & Feedback',
          'Community-Zugang',
          'Fortschritt-Tracking'
        ],
        includes1to1: true,
        sessionCount: 2
      }
    }
  },
  'youtube-creator': {
    name: 'YouTube Creator Programm',
    duration: 30,
    plans: {
      youtube: {
        name: 'YouTube Creator',
        price: 100,
        currency: 'EUR',
        features: [
          'Persönliches Briefing',
          '2 x 1:1 Coaching-Calls',
          'YouTube-spezifische Strategie',
          'Kanal-Analyse & SEO-Tipps',
          'Community-Zugang',
          'Fortschritt-Tracking'
        ],
        includes1to1: true,
        sessionCount: 2
      }
    }
  }
} as const

export type CourseType = keyof typeof COURSE_PRICING
export type PlanType = 'fast' | 'business' | 'infinity' | 'tiktok' | 'youtube'

/**
 * Get pricing for a specific course and plan
 */
export const getPricing = (course: CourseType, plan: PlanType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (COURSE_PRICING[course].plans as any)[plan]
}

/**
 * Calculate VAT (19% for Germany/EU)
 */
export const calculateVAT = (amount: number): number => {
  const vatRate = parseFloat(process.env.VAT_RATE || '0.19')
  return Math.round(amount * vatRate * 100) / 100
}

/**
 * Calculate total with VAT
 */
export const calculateTotal = (amount: number): number => {
  const vat = calculateVAT(amount)
  return amount + vat
}

/**
 * Format price for display
 */
export const formatPrice = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Stripe Payment Intent Metadata
 * This data is attached to each payment for tracking
 */
export interface PaymentMetadata {
  courseType: CourseType
  planType: PlanType
  courseName: string
  planName: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  leadSource?: string
  affiliateId?: string
}

/**
 * Create payment metadata for Stripe
 */
export const createPaymentMetadata = (data: {
  course: CourseType
  plan: PlanType
  name: string
  email: string
  phone?: string
  leadSource?: string
  affiliateId?: string
}): PaymentMetadata => {
  const courseInfo = COURSE_PRICING[data.course]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planInfo = (courseInfo.plans as any)[data.plan]
  
  return {
    courseType: data.course,
    planType: data.plan,
    courseName: courseInfo.name,
    planName: planInfo.name,
    customerName: data.name,
    customerEmail: data.email,
    customerPhone: data.phone,
    leadSource: data.leadSource,
    affiliateId: data.affiliateId
  }
}

/**
 * Stripe webhook event types we handle
 */
export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_REFUNDED: 'charge.refunded',
  CUSTOMER_CREATED: 'customer.created'
} as const

/**
 * Payment status mapping
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded'
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]
