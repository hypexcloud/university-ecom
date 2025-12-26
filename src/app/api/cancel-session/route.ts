import { NextRequest, NextResponse } from 'next/server'
import { cancelSession } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, enrollmentId, refundSession } = body

    if (!sessionId || !enrollmentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await cancelSession(
      sessionId,
      enrollmentId,
      refundSession !== false // Default to true
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Session erfolgreich storniert'
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Cancellation failed' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error cancelling session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
