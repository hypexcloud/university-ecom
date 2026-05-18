import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/server/auth'
import { getSignedVideoUrl } from '@/lib/server/video'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth()
    const { id: videoId } = await params

    // TODO: verify entitlement — check that the user has access to the course
    // containing this video via enrollments + course_resources tables.
    // For now, any authenticated user can get a signed URL.

    const signedUrl = getSignedVideoUrl(videoId)

    if (!signedUrl) {
      return NextResponse.json({
        error: 'Video-Streaming nicht konfiguriert (BUNNY_STREAM_* env vars fehlen)',
      }, { status: 503 })
    }

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
