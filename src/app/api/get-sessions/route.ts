import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const enrollmentId = searchParams.get('enrollmentId')
    const coachId = searchParams.get('coachId')

    // Build query based on parameters
    let sessionsQuery

    if (coachId) {
      // Get all sessions for a coach
      sessionsQuery = query(
        collection(db, 'sessions'),
        where('coachId', '==', coachId),
        orderBy('scheduledAt', 'desc')
      )
    } else if (userId) {
      // Get sessions for a user
      if (enrollmentId) {
        sessionsQuery = query(
          collection(db, 'sessions'),
          where('userId', '==', userId),
          where('enrollmentId', '==', enrollmentId),
          orderBy('scheduledAt', 'desc')
        )
      } else {
        sessionsQuery = query(
          collection(db, 'sessions'),
          where('userId', '==', userId),
          orderBy('scheduledAt', 'desc')
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Missing userId or coachId' },
        { status: 400 }
      )
    }

    const snapshot = await getDocs(sessionsQuery)
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ sessions })
  } catch (error: any) {
    console.error('Error getting sessions:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
