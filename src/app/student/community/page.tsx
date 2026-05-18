import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { communityPosts, customers } from '@/lib/server/db/schema'
import { desc, isNotNull, eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'

const CATS = [
  { value: 'news', label: 'News' },
  { value: 'updates', label: 'Updates' },
  { value: 'ankuendigungen', label: 'Ankündigungen' },
  { value: 'erfolge', label: 'Erfolge' },
]

export default async function StudentCommunityPage() {
  await requireAuth()

  const posts = await db
    .select({ id: communityPosts.id, category: communityPosts.category, title: communityPosts.title, body: communityPosts.body, publishedAt: communityPosts.publishedAt, authorName: customers.firstName })
    .from(communityPosts)
    .innerJoin(customers, eq(communityPosts.authorUid, customers.uid))
    .where(isNotNull(communityPosts.publishedAt))
    .orderBy(desc(communityPosts.publishedAt))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community</h1>
      <Tabs defaultValue="news">
        <TabsList className="grid w-full grid-cols-4">
          {CATS.map((c) => <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>)}
        </TabsList>
        {CATS.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            {posts.filter((p) => p.category === cat.value).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Noch keine Beiträge.</p>
            ) : (
              <div className="space-y-3">
                {posts.filter((p) => p.category === cat.value).map((post) => (
                  <Link key={post.id} href={`/student/community/${post.id}`}>
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <span className="text-xs text-muted-foreground">{post.publishedAt?.toLocaleDateString('de-DE')}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
                        <p className="text-xs text-primary mt-2">Weiterlesen →</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
