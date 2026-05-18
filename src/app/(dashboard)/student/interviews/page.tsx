import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { interviews } from '@/lib/server/db/schema'
import { asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Video } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/empty-state'

export default async function StudentInterviewsPage() {
  await requireAuth()
  const items = await db.select().from(interviews).orderBy(asc(interviews.orderIndex))

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Interviews & Videos</h1>
        <EmptyState icon={Video} title="Noch keine Videos" description="Videos werden in Kürze hinzugefügt." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Interviews & Videos</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <Link key={v.id} href={`/student/interviews/${v.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer overflow-hidden">
              {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={v.title} className="w-full h-40 object-cover" />}
              <CardContent className="pt-4">
                <h3 className="font-medium">{v.title}</h3>
                {v.category && <Badge variant="outline" className="mt-1">{v.category}</Badge>}
                {v.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
