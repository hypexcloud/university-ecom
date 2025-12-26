import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coachId, slots, bufferMinutes, sessionDuration, maxSessionsPerDay } = body

    if (!coachId || !slots) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const availabilityData = {
      coachId,
      slots,
      bufferMinutes: bufferMinutes || 15,
      sessionDuration: sessionDuration || 60,
      maxSessionsPerDay: maxSessionsPerDay || 8,
      updatedAt: Timestamp.now()
    }

    await setDoc(doc(db, 'availability', coachId), availabilityData, { merge: true })

    return NextResponse.json({
      success: true,
      message: 'Availability saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving availability:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
