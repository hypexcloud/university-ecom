import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateByCode, trackReferralClick } from '@/lib/affiliate-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateCode, userAgent } = body

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Missing affiliate code' },
        { status: 400 }
      )
    }

    // Verify affiliate exists
    const affiliate = await getAffiliateByCode(affiliateCode)
    
    if (!affiliate) {
      return NextResponse.json(
        { error: 'Invalid affiliate code' },
        { status: 404 }
      )
    }

    // Track the click
    const result = await trackReferralClick({
      affiliateCode,
      affiliateId: affiliate.id,
      userAgent
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Referral tracked'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to track referral' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error tracking referral:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
