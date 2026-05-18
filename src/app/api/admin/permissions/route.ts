import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { adminPermissions } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ perms: {} })
  }

  const [row] = await db
    .select()
    .from(adminPermissions)
    .where(eq(adminPermissions.uid, user.id))
    .limit(1)

  if (!row) {
    return NextResponse.json({ perms: {} })
  }

  return NextResponse.json({ perms: row.perms })
}
