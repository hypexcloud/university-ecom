import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  // Only return the authenticated user's own profile
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
  }

  const [customer] = await db
    .select({
      uid: customers.uid,
      email: customers.email,
      firstName: customers.firstName,
      lastName: customers.lastName,
      discordUsername: customers.discordUsername,
      whatsapp: customers.whatsapp,
      status: customers.status,
    })
    .from(customers)
    .where(eq(customers.uid, user.id))
    .limit(1)

  if (!customer) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json(customer)
}
