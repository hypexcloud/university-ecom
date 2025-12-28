import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, reviewNotes } = body
    const submissionId = params.id

    // TODO: Get admin user ID from session
    const reviewedBy = 'admin' // Replace with actual admin ID

    await updateDoc(doc(db, 'intakeSubmissions', submissionId), {
      status,
      reviewNotes,
      reviewedBy,
      reviewedAt: Timestamp.now(),
    })

    return NextResponse.json({
      success: true,
      message: 'Submission updated',
    })
  } catch (error: any) {
    console.error('Error updating intake submission:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
