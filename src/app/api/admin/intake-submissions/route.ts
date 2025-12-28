import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import type { IntakeSubmission } from '@/lib/intake-types'

export async function GET(request: NextRequest) {
  try {
    const submissionsQuery = query(
      collection(db, 'intakeSubmissions'),
      orderBy('submittedAt', 'desc')
    )

    const snapshot = await getDocs(submissionsQuery)
    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IntakeSubmission[]

    return NextResponse.json({ submissions })
  } catch (error: any) {
    console.error('Error getting intake submissions:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
