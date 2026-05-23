export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/server/db'
import { communityPosts, customers } from '@/lib/server/db/schema'
import { desc, isNotNull, eq } from 'drizzle-orm'

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'updates', label: 'Updates' },
  { value: 'ankuendigungen', label: 'Ankündigungen' },
  { value: 'erfolge', label: 'Erfolge' },
]

export default async function CommunityPage() {
  const posts = await db
    .select({
      id: communityPosts.id,
      category: communityPosts.category,
      title: communityPosts.title,
      body: communityPosts.body,
      publishedAt: communityPosts.publishedAt,
      authorFirstName: customers.firstName,
    })
    .from(communityPosts)
    .innerJoin(customers, eq(communityPosts.authorUid, customers.uid))
    .where(isNotNull(communityPosts.publishedAt))
    .orderBy(desc(communityPosts.publishedAt))

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Community</h1>

      <Tabs defaultValue="news">
        <TabsList className="grid w-full grid-cols-4">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          const filtered = posts.filter((p) => p.category === cat.value)
          return (
            <TabsContent key={cat.value} value={cat.value}>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Noch keine Beiträge in dieser Kategorie.</p>
              ) : (
                <div className="space-y-4">
                  {filtered.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {post.publishedAt?.toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{post.body}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
