import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { calculateLeadScore, getQualificationLevel } from '@/lib/lead-scoring'
import type { IntakeSubmission } from '@/lib/intake-types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Calculate lead score
    const leadScore = calculateLeadScore(body)
    const qualification = getQualificationLevel(leadScore)

    // Create submission
    const submissionData: Omit<IntakeSubmission, 'id'> = {
      ...body,
      leadScore,
      qualification,
      status: 'pending',
      submittedAt: Timestamp.now(),
    }

    // Save to Firebase
    const docRef = await addDoc(collection(db, 'intakeSubmissions'), submissionData)

    const submission: IntakeSubmission = {
      id: docRef.id,
      ...submissionData,
    }

    return NextResponse.json({
      success: true,
      submission,
      leadScore,
      qualification,
    })
  } catch (error: any) {
    console.error('Error submitting intake:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
