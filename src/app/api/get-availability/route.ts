import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const coachId = searchParams.get('coachId')

    if (!coachId) {
      return NextResponse.json(
        { error: 'Missing coachId' },
        { status: 400 }
      )
    }

    const availabilityDoc = await getDoc(doc(db, 'availability', coachId))

    if (!availabilityDoc.exists()) {
      return NextResponse.json({ availability: null })
    }

    return NextResponse.json({
      availability: availabilityDoc.data()
    })
  } catch (error: any) {
    console.error('Error getting availability:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
