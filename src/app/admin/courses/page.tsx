import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { courses, courseModules, courseWeeks, courseResources, products } from '@/lib/server/db/schema'
import { eq, asc, count } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { BookOpen } from 'lucide-react'

export default async function AdminCoursesPage() {
  await requireAdmin('products')

  const allCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      isActive: courses.isActive,
      productTitle: products.title,
    })
    .from(courses)
    .innerJoin(products, eq(courses.productId, products.id))

  const allModules = await db.select().from(courseModules).orderBy(asc(courseModules.orderIndex))
  const allWeeks = await db.select().from(courseWeeks).orderBy(asc(courseWeeks.orderIndex))
  const allResources = await db.select().from(courseResources).orderBy(asc(courseResources.orderIndex))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kursverwaltung</h1>

      {allCourses.map((course) => {
        const modules = allModules.filter((m) => m.courseId === course.id)

        return (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {course.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{course.productTitle}</Badge>
                  <Badge variant={course.isActive ? 'default' : 'destructive'}>
                    {course.isActive ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {modules.length === 0 ? (
                <p className="text-muted-foreground">Keine Module konfiguriert.</p>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod, i) => {
                    const weeks = allWeeks.filter((w) => w.moduleId === mod.id)
                    const resourceCount = weeks.reduce((sum, w) =>
                      sum + allResources.filter((r) => r.weekId === w.id).length, 0)

                    return (
                      <div key={mod.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground mr-2">#{i + 1}</span>
                            <span className="font-medium">{mod.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{weeks.length} Wochen</span>
                            <span>·</span>
                            <span>{resourceCount} Ressourcen</span>
                          </div>
                        </div>

                        {weeks.length > 0 && (
                          <div className="mt-2 pl-6 space-y-1">
                            {weeks.map((week) => {
                              const resources = allResources.filter((r) => r.weekId === week.id)
                              return (
                                <div key={week.id} className="text-sm">
                                  <span className="text-muted-foreground">{week.title}</span>
                                  {resources.length > 0 && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      ({resources.map((r) => r.type).join(', ')})
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
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
