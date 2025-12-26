import { NextRequest, NextResponse } from 'next/server'
import { createSessionBooking, type SessionType, type MeetingType } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      coachId,
      enrollmentId,
      scheduledAt,
      type,
      meetingType,
      duration,
      topic,
      notes,
      meetingLink,
      phoneNumber,
      location
    } = body

    // Validate required fields
    if (!userId || !coachId || !enrollmentId || !scheduledAt || !type || !meetingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse scheduled date
    const scheduledDate = new Date(scheduledAt)
    
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Create the booking
    const result = await createSessionBooking({
      userId,
      coachId,
      enrollmentId,
      scheduledAt: scheduledDate,
      type: type as SessionType,
      meetingType: meetingType as MeetingType,
      duration: duration || 60,
      topic,
      notes,
      meetingLink,
      phoneNumber,
      location
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        sessionId: result.sessionId,
        message: 'Session erfolgreich gebucht'
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Booking failed' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error booking session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
