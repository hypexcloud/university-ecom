import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, setDoc, Timestamp } from 'firebase/firestore'
import { generateAffiliateCode, isAffiliateCodeAvailable } from '@/lib/affiliate-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, userId, approved } = body

    if (!applicationId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update application status
    await updateDoc(doc(db, 'affiliateApplications', applicationId), {
      status: approved ? 'approved' : 'rejected',
      reviewedAt: Timestamp.now()
    })

    if (approved) {
      // Generate unique affiliate code
      let affiliateCode = ''
      let isAvailable = false
      let attempts = 0
      
      while (!isAvailable && attempts < 10) {
        affiliateCode = generateAffiliateCode(`USER${attempts}`)
        isAvailable = await isAffiliateCodeAvailable(affiliateCode)
        attempts++
      }

      if (!isAvailable) {
        throw new Error('Failed to generate unique affiliate code')
      }

      // Update user to affiliate role and add affiliate data
      await updateDoc(doc(db, 'users', userId), {
        role: 'affiliate',
        affiliateData: {
          code: affiliateCode,
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0,
          totalReferrals: 0,
          conversionRate: 0,
          joinedAt: Timestamp.now()
        },
        updatedAt: Timestamp.now()
      })
    }

    return NextResponse.json({
      success: true,
      message: approved ? 'Affiliate approved' : 'Application rejected'
    })
  } catch (error: any) {
    console.error('Error approving affiliate:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
