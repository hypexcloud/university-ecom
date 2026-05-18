import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { interviews } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { ArrowLeft } from 'lucide-react'

interface Props { params: Promise<{ videoId: string }> }

export default async function InterviewVideoPage({ params }: Props) {
  await requireAuth()
  const { videoId } = await params

  const [video] = await db.select().from(interviews).where(eq(interviews.id, videoId)).limit(1)
  if (!video) notFound()

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/student/interviews" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Interviews
      </Link>
      <Card>
        <CardHeader><CardTitle>{video.title}</CardTitle></CardHeader>
        <CardContent>
          {video.videoUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe src={video.videoUrl} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" />
            </div>
          )}
          {video.description && <p className="text-sm text-muted-foreground">{video.description}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
