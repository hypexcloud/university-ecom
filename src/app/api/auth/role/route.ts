import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { adminPermissions, mentors } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Returns the user's primary role for post-login redirect.
 * Priority: admin > mentor > student
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ role: 'guest', redirect: '/login' })
    }

    // Check admin
    const [admin] = await db
      .select()
      .from(adminPermissions)
      .where(eq(adminPermissions.uid, user.id))
      .limit(1)

    if (admin) {
      return NextResponse.json({ role: 'admin', redirect: '/admin' })
    }

    // Check mentor
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.uid, user.id))
      .limit(1)

    if (mentor?.isActive) {
      return NextResponse.json({ role: 'mentor', redirect: '/mentor' })
    }

    // Default: student
    return NextResponse.json({ role: 'student', redirect: '/student' })
  } catch {
    return NextResponse.json({ role: 'student', redirect: '/student' })
  }
}
