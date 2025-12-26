/**
 * Affiliate System Utilities
 * 
 * Handles affiliate code generation, commission calculations, and tracking
 */

import { db } from './firebase/config'
import { 
  collection, 
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  addDoc
} from 'firebase/firestore'

/**
 * Commission rates by plan
 */
export const COMMISSION_RATES = {
  fast: 0.10,      // 10% for Fast Plan (€200)
  business: 0.15,  // 15% for Business Plan (€1000)
  infinity: 0.20   // 20% for Infinity Plan (€3000)
} as const

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected'

/**
 * Generate unique affiliate code from name
 */
export function generateAffiliateCode(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${cleaned.substring(0, 6)}${random}`.toUpperCase()
}

/**
 * Calculate commission based on plan and amount
 */
export function calculateCommission(planType: string, amount: number): {
  rate: number
  amount: number
} {
  const rateKey = planType.toLowerCase() as keyof typeof COMMISSION_RATES
  const rate = COMMISSION_RATES[rateKey] || 0.10
  
  return {
    rate,
    amount: Math.round(amount * rate * 100) / 100
  }
}

/**
 * Check if affiliate code exists
 */
export async function isAffiliateCodeAvailable(code: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('affiliateData.code', '==', code))
    const snapshot = await getDocs(q)
    return snapshot.empty
  } catch (error) {
    console.error('Error checking affiliate code:', error)
    return false
  }
}

/**
 * Create affiliate application
 */
export async function createAffiliateApplication(data: {
  userId: string
  email: string
  name: string
  reason: string
  website?: string
  experience?: string
}): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    const applicationRef = await addDoc(collection(db, 'affiliateApplications'), {
      ...data,
      status: 'pending',
      appliedAt: Timestamp.now()
    })

    return {
      success: true,
      applicationId: applicationRef.id
    }
  } catch (error: any) {
    console.error('Error creating affiliate application:', error)
    return {
      success: false,
      error: error.message || 'Failed to create application'
    }
  }
}

/**
 * Get affiliate data for user
 */
export async function getAffiliateData(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      return null
    }

    const userData = userDoc.data()
    return userData.affiliateData || null
  } catch (error) {
    console.error('Error getting affiliate data:', error)
    return null
  }
}

/**
 * Get affiliate commissions
 */
export async function getAffiliateCommissions(affiliateId: string) {
  try {
    const commissionsQuery = query(
      collection(db, 'commissions'),
      where('affiliateId', '==', affiliateId)
    )
    
    const snapshot = await getDocs(commissionsQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting commissions:', error)
    return []
  }
}

/**
 * Get affiliate referral clicks
 */
export async function getAffiliateClicks(affiliateCode: string) {
  try {
    const clicksQuery = query(
      collection(db, 'referralClicks'),
      where('affiliateCode', '==', affiliateCode)
    )
    
    const snapshot = await getDocs(clicksQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting clicks:', error)
    return []
  }
}

/**
 * Track referral click
 */
export async function trackReferralClick(data: {
  affiliateCode: string
  affiliateId: string
  userAgent?: string
}): Promise<{ success: boolean }> {
  try {
    await addDoc(collection(db, 'referralClicks'), {
      ...data,
      timestamp: Timestamp.now(),
      converted: false
    })

    return { success: true }
  } catch (error) {
    console.error('Error tracking click:', error)
    return { success: false }
  }
}

/**
 * Record commission for order
 */
export async function recordCommission(data: {
  affiliateId: string
  orderId: string
  amount: number
  rate: number
}): Promise<{ success: boolean; commissionId?: string }> {
  try {
    const commissionRef = await addDoc(collection(db, 'commissions'), {
      ...data,
      status: 'pending' as CommissionStatus,
      createdAt: Timestamp.now()
    })

    // Update affiliate earnings
    const userRef = doc(db, 'users', data.affiliateId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const currentData = userDoc.data().affiliateData || {}
      await updateDoc(userRef, {
        'affiliateData.pendingEarnings': (currentData.pendingEarnings || 0) + data.amount,
        'affiliateData.totalReferrals': (currentData.totalReferrals || 0) + 1
      })
    }

    return {
      success: true,
      commissionId: commissionRef.id
    }
  } catch (error: any) {
    console.error('Error recording commission:', error)
    return {
      success: false
    }
  }
}

/**
 * Update commission status
 */
export async function updateCommissionStatus(
  commissionId: string,
  status: CommissionStatus,
  affiliateId: string,
  amount: number
): Promise<{ success: boolean }> {
  try {
    await updateDoc(doc(db, 'commissions', commissionId), {
      status,
      ...(status === 'approved' && { approvedAt: Timestamp.now() }),
      ...(status === 'paid' && { paidAt: Timestamp.now() })
    })

    // Update affiliate earnings based on status
    const userRef = doc(db, 'users', affiliateId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const currentData = userDoc.data().affiliateData || {}
      
      if (status === 'approved') {
        // Move from pending to total
        await updateDoc(userRef, {
          'affiliateData.totalEarnings': (currentData.totalEarnings || 0) + amount
        })
      } else if (status === 'paid') {
        // Move from pending to paid
        await updateDoc(userRef, {
          'affiliateData.pendingEarnings': Math.max(0, (currentData.pendingEarnings || 0) - amount),
          'affiliateData.paidEarnings': (currentData.paidEarnings || 0) + amount,
          'affiliateData.lastPayoutAt': Timestamp.now()
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating commission status:', error)
    return { success: false }
  }
}

/**
 * Get affiliate by code
 */
export async function getAffiliateByCode(code: string) {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('affiliateData.code', '==', code)
    )
    
    const snapshot = await getDocs(usersQuery)
    
    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    }
  } catch (error) {
    console.error('Error getting affiliate by code:', error)
    return null
  }
}

/**
 * Generate affiliate referral URL
 */
export function generateReferralUrl(code: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com')
  return `${base}/checkout?ref=${code}`
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(clicks: number, conversions: number): number {
  if (clicks === 0) return 0
  return Math.round((conversions / clicks) * 100 * 10) / 10
}
