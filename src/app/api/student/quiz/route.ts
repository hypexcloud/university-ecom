import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import type { Quiz, QuizAttempt } from '@/lib/course-types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const quizId = searchParams.get('quizId')
    const userId = searchParams.get('userId')

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Get quiz
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId))
    
    if (!quizDoc.exists()) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    const quiz = {
      id: quizDoc.id,
      ...quizDoc.data(),
    } as Quiz

    // Get previous attempts if userId provided
    let attempts: QuizAttempt[] = []
    if (userId) {
      const attemptsQuery = query(
        collection(db, 'quizAttempts'),
        where('quizId', '==', quizId),
        where('userId', '==', userId),
        orderBy('attemptNumber', 'desc')
      )

      const attemptsSnapshot = await getDocs(attemptsQuery)
      attempts = attemptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as QuizAttempt[]
    }

    return NextResponse.json({
      quiz,
      attempts,
    })
  } catch (error: any) {
    console.error('Error getting quiz:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
