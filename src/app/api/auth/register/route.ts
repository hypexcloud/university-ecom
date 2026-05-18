import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { z } from 'zod'

const registerSchema = z.object({
  uid: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  discordUsername: z.string().nullable(),
  whatsapp: z.string().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    await db.insert(customers).values({
      uid: data.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      discordUsername: data.discordUsername,
      whatsapp: data.whatsapp,
      status: 'active',
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.errors },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen' },
      { status: 500 },
    )
  }
}
