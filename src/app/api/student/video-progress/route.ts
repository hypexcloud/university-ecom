import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { updateVideoProgress } from '@/lib/course-utils'
import type { StudentProgress } from '@/lib/course-types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { progressId, resourceId, watchedSeconds, totalSeconds } = body

    if (!progressId || !resourceId || watchedSeconds === undefined || totalSeconds === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current progress
    const progressDoc = await getDoc(doc(db, 'studentProgress', progressId))
    
    if (!progressDoc.exists()) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      )
    }

    const currentProgress = {
      id: progressDoc.id,
      ...progressDoc.data(),
    } as StudentProgress

    // Update video progress
    await updateVideoProgress(
      progressId,
      resourceId,
      watchedSeconds,
      totalSeconds,
      currentProgress
    )

    // Check if video is completed (90% watched)
    const percentWatched = (watchedSeconds / totalSeconds) * 100
    const isCompleted = percentWatched >= 90

    return NextResponse.json({
      success: true,
      completed: isCompleted,
      percentWatched: Math.round(percentWatched),
    })
  } catch (error: any) {
    console.error('Error updating video progress:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
