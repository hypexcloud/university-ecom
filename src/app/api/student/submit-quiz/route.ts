import { NextRequest, NextResponse } from 'next/server'
import { submitQuizAttempt } from '@/lib/course-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { quizId, userId, enrollmentId, answers, timeSpent } = body

    if (!quizId || !userId || !enrollmentId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const attempt = await submitQuizAttempt(
      quizId,
      userId,
      enrollmentId,
      answers,
      timeSpent || 0
    )

    // Update student progress with quiz completion
    if (attempt.passed) {
      const { db } = await import('@/lib/firebase/config')
      const { collection, query, where, getDocs, updateDoc, doc } = await import('firebase/firestore')
      
      // Find student progress
      const progressQuery = query(
        collection(db, 'studentProgress'),
        where('userId', '==', userId),
        where('enrollmentId', '==', enrollmentId)
      )

      const progressSnapshot = await getDocs(progressQuery)
      
      if (!progressSnapshot.empty) {
        const progressDoc = progressSnapshot.docs[0]
        const currentProgress = progressDoc.data()

        // Add quiz to completed quizzes
        const quizzesCompleted = currentProgress.quizzesCompleted || []
        if (!quizzesCompleted.includes(quizId)) {
          quizzesCompleted.push(quizId)
        }

        // Add quiz score
        const quizScores = currentProgress.quizScores || []
        quizScores.push({
          quizId,
          score: attempt.score,
          maxScore: attempt.maxScore,
          completedAt: attempt.submittedAt,
        })

        await updateDoc(progressDoc.ref, {
          quizzesCompleted,
          quizScores,
          updatedAt: new Date(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      attempt,
    })
  } catch (error: any) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
