import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { adminPermissions, mentors } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Returns ALL roles the user has (for portal switcher).
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ roles: [] })

    const roles: string[] = ['student'] // Everyone is at least a student

    const [admin] = await db.select().from(adminPermissions).where(eq(adminPermissions.uid, user.id)).limit(1)
    if (admin) roles.push('admin')

    const [mentor] = await db.select().from(mentors).where(eq(mentors.uid, user.id)).limit(1)
    if (mentor?.isActive) roles.push('mentor')

    return NextResponse.json({ roles })
  } catch {
    return NextResponse.json({ roles: ['student'] })
  }
}
