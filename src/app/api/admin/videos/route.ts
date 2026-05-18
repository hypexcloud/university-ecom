import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/server/auth'
import { listVideos, createVideo, getUploadUrl } from '@/lib/server/bunny'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin('videos')
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10)
    const data = await listVideos(page)
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Response) return error
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const createSchema = z.object({ title: z.string().min(1) })

export async function POST(request: NextRequest) {
  try {
    await requireAdmin('videos')
    const { title } = createSchema.parse(await request.json())
    const video = await createVideo(title)
    const uploadUrl = getUploadUrl(video.guid)
    return NextResponse.json({ videoId: video.guid, uploadUrl }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
