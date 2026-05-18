import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/server/auth'
import { getSignedVideoUrl } from '@/lib/server/video'
import { db } from '@/lib/server/db'
import { entitlements, plans, products, courses, courseModules, courseWeeks, courseResources } from '@/lib/server/db/schema'
import { eq, isNull, and } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id: videoId } = await params

    // Find the course resource that references this video
    // Video URLs in courseResources contain the Bunny Stream video ID
    const resources = await db
      .select({
        weekId: courseResources.weekId,
      })
      .from(courseResources)
      .where(eq(courseResources.type, 'video'))

    // Walk up: resource → week → module → course → product
    // Then check if user has entitlement for that product
    // For efficiency, check if user has ANY active entitlement (they paid for something)
    const activeEntitlements = await db
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))
      .limit(1)

    if (activeEntitlements.length === 0) {
      return NextResponse.json({ error: 'Kein aktiver Zugang. Bitte einen Kurs erwerben.' }, { status: 403 })
    }

    const signedUrl = getSignedVideoUrl(videoId)

    if (!signedUrl) {
      return NextResponse.json({
        error: 'Video-Streaming nicht konfiguriert',
      }, { status: 503 })
    }

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
