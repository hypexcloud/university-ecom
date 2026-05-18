import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { entitlements, plans, products, courses, courseModules, courseWeeks, courseResources, moduleProgress } from '@/lib/server/db/schema'
import { eq, and, isNull, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { BookOpen, Video, FileText, Link as LinkIcon, CheckCircle } from 'lucide-react'

export default async function CoursePage() {
  const user = await requireAuth()

  const enrolled = await db
    .select({
      entitlementId: entitlements.id,
      planCode: plans.code,
      productId: products.id,
      productTitle: products.title,
      courseId: courses.id,
      courseTitle: courses.title,
    })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .innerJoin(products, eq(plans.productId, products.id))
    .innerJoin(courses, eq(courses.productId, products.id))
    .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))

  if (enrolled.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Kursinhalte</h1>
        <Card><CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">Du hast noch keine Kurse freigeschaltet.</p>
        </CardContent></Card>
      </div>
    )
  }

  const courseIds = [...new Set(enrolled.map((e) => e.courseId))]
  const allModules = await db.select().from(courseModules).where(eq(courseModules.isActive, true)).orderBy(asc(courseModules.orderIndex))
  const allWeeks = await db.select().from(courseWeeks).orderBy(asc(courseWeeks.orderIndex))
  const allResources = await db.select().from(courseResources).orderBy(asc(courseResources.orderIndex))

  const progress = await db.select().from(moduleProgress).where(eq(moduleProgress.customerUid, user.uid))
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.resourceId))

  const icon = (type: string) => {
    if (type === 'video') return <Video className="h-4 w-4" />
    if (type === 'pdf') return <FileText className="h-4 w-4" />
    return <LinkIcon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kursinhalte</h1>
      {enrolled.map((e) => {
        const modules = allModules.filter((m) => m.courseId === e.courseId)
        return (
          <Card key={e.entitlementId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{e.courseTitle}</CardTitle>
                <Badge variant="outline">{e.planCode}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {modules.length === 0 ? (
                <p className="text-muted-foreground">Inhalte werden in Kürze freigeschaltet.</p>
              ) : (
                <div className="space-y-4">
                  {modules.map((mod) => {
                    const weeks = allWeeks.filter((w) => w.moduleId === mod.id)
                    return (
                      <div key={mod.id} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-2">{mod.title}</h3>
                        {weeks.map((week) => {
                          const resources = allResources.filter((r) => r.weekId === week.id)
                          return (
                            <div key={week.id} className="pl-4 border-l-2 border-muted mt-2">
                              <p className="text-sm font-medium mb-1">{week.title}</p>
                              {resources.map((res) => (
                                <div key={res.id} className="flex items-center gap-2 text-sm py-1">
                                  {completedIds.has(res.id) ? <CheckCircle className="h-4 w-4 text-green-500" /> : icon(res.type)}
                                  <span className={completedIds.has(res.id) ? 'line-through text-muted-foreground' : ''}>{res.title}</span>
                                  {res.duration && <span className="text-xs text-muted-foreground">({Math.ceil(res.duration / 60)} min)</span>}
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
