import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { analyticsEvents } from '@/lib/server/db/schema'
import { z } from 'zod'

const intakeSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  experience: z.object({
    currentExperience: z.string(),
    primaryGoal: z.string(),
    timeCommitment: z.string(),
    budget: z.string(),
  }).passthrough(),
  courseSelection: z.object({
    interestedCourse: z.string(),
    preferredPlan: z.string(),
  }).passthrough(),
  motivation: z.object({
    motivation: z.string(),
    expectedOutcome: z.string(),
  }).passthrough(),
  marketingConsent: z.object({
    marketingConsent: z.boolean(),
    dataProcessingConsent: z.boolean(),
    termsAccepted: z.boolean(),
  }),
}).passthrough()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = intakeSchema.parse(body)

    // Store as analytics event (intake_submission)
    const [event] = await db.insert(analyticsEvents).values({
      customerUid: null,
      name: 'intake_submission',
      props: {
        ...data,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      },
    }).returning()

    return NextResponse.json({
      success: true,
      id: String(event.id),
      leadScore: 50, // Placeholder — real scoring comes later
      qualification: 'warm',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
