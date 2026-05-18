import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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

    // First try session-based auth (works when email confirmation is disabled)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Session exists — use the authenticated user's id (most secure)
      await insertCustomer(user.id, user.email!, data)
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // No session (email confirmation enabled) — verify uid exists via service role
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ error: 'Server-Konfiguration fehlt' }, { status: 500 })
    }

    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: authUser, error } = await admin.auth.admin.getUserById(data.uid)
    if (error || !authUser?.user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 })
    }

    // Verify email matches to prevent uid spoofing
    if (authUser.user.email !== data.email) {
      return NextResponse.json({ error: 'E-Mail stimmt nicht überein' }, { status: 403 })
    }

    await insertCustomer(data.uid, data.email, data)
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

async function insertCustomer(uid: string, email: string, data: { firstName: string; lastName: string; discordUsername: string | null; whatsapp: string | null }) {
  await db.insert(customers).values({
    uid,
    email,
    firstName: data.firstName,
    lastName: data.lastName,
    discordUsername: data.discordUsername,
    whatsapp: data.whatsapp,
    status: 'active',
  }).onConflictDoNothing()
}
