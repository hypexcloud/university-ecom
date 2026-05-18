import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { z } from 'zod'

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  discordUsername: z.string().nullable(),
  whatsapp: z.string().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify the caller's JWT — only the authenticated user can create their own profile
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await request.json()
    const data = registerSchema.parse(body)

    await db.insert(customers).values({
      uid: user.id,
      email: user.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      discordUsername: data.discordUsername,
      whatsapp: data.whatsapp,
      status: 'active',
    }).onConflictDoNothing()

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Eingabedaten', details: error.issues },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen' },
      { status: 500 },
    )
  }
}
