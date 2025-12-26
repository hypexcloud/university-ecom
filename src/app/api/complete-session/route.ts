import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, status, completionNotes } = body

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update session
    await updateDoc(doc(db, 'sessions', sessionId), {
      status,
      completionNotes: completionNotes || '',
      updatedAt: Timestamp.now()
    })

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully'
    })
  } catch (error: any) {
    console.error('Error completing session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
