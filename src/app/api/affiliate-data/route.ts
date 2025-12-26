import { NextRequest, NextResponse } from 'next/server'
import { getAffiliateData, getAffiliateCommissions, getAffiliateClicks } from '@/lib/affiliate-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Get affiliate data
    const affiliateData = await getAffiliateData(userId)

    if (!affiliateData) {
      return NextResponse.json({ affiliateData: null })
    }

    // Get commissions
    const commissions = await getAffiliateCommissions(userId)

    // Get clicks
    const clicks = await getAffiliateClicks(affiliateData.code)

    return NextResponse.json({
      affiliateData,
      commissions,
      clicks
    })
  } catch (error: any) {
    console.error('Error getting affiliate data:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
