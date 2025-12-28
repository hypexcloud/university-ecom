import { NextRequest, NextResponse } from 'next/server'
import { getStudentProgress, initializeStudentProgress } from '@/lib/course-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const enrollmentId = searchParams.get('enrollmentId')

    if (!userId || !enrollmentId) {
      return NextResponse.json(
        { error: 'User ID and enrollment ID are required' },
        { status: 400 }
      )
    }

    let progress = await getStudentProgress(userId, enrollmentId)

    // If no progress exists, initialize it
    if (!progress) {
      // Get enrollment details to determine course type
      const { db } = await import('@/lib/firebase/config')
      const { doc, getDoc } = await import('firebase/firestore')
      
      const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId))
      
      if (enrollmentDoc.exists()) {
        const enrollment = enrollmentDoc.data()
        const courseType = enrollment.courseType || 'ai'
        const courseId = enrollment.courseId || `${courseType}-course`
        
        const progressId = await initializeStudentProgress(
          userId,
          enrollmentId,
          courseId,
          courseType
        )
        
        progress = await getStudentProgress(userId, enrollmentId)
      }
    }

    return NextResponse.json({ progress })
  } catch (error: any) {
    console.error('Error getting student progress:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
