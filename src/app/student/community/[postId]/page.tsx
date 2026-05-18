import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { communityPosts, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { ArrowLeft } from 'lucide-react'

interface Props { params: Promise<{ postId: string }> }

export default async function CommunityPostPage({ params }: Props) {
  await requireAuth()
  const { postId } = await params

  const [post] = await db
    .select({ id: communityPosts.id, category: communityPosts.category, title: communityPosts.title, body: communityPosts.body, publishedAt: communityPosts.publishedAt, authorName: customers.firstName })
    .from(communityPosts)
    .innerJoin(customers, eq(communityPosts.authorUid, customers.uid))
    .where(eq(communityPosts.id, postId))
    .limit(1)

  if (!post) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/student/community" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Community
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">{post.publishedAt?.toLocaleDateString('de-DE')} · {post.authorName}</span>
          </div>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{post.body}</div>
        </CardContent>
      </Card>
    </div>
  )
}
