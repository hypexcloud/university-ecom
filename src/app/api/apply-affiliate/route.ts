import { NextRequest, NextResponse } from 'next/server'
import { createAffiliateApplication } from '@/lib/affiliate-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, name, reason, website, experience } = body

    if (!userId || !email || !name || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createAffiliateApplication({
      userId,
      email,
      name,
      reason,
      website,
      experience
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        applicationId: result.applicationId,
        message: 'Application submitted successfully'
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to submit application' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error applying for affiliate:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
