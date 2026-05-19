import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/server/db'
import { courses, courseModules, courseWeeks, courseResources, moduleProgress, entitlements, plans } from '@/lib/server/db/schema'
import { eq, and, isNull, asc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { PlanBadge } from '@/components/dashboard/plan-badge'
import { Video, FileText, Link as LinkIcon, CheckCircle, Lock } from 'lucide-react'

interface Props { params: Promise<{ courseId: string }> }

export default async function CoursePlayerPage({ params }: Props) {
  const user = await requireAuth()
  const { courseId } = await params

  const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1)
  if (!course) notFound()

  // Verify entitlement
  const enrolled = await db
    .select({ planCode: plans.code, releaseStrategy: plans.releaseStrategy })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .where(and(eq(entitlements.customerUid, user.uid), eq(plans.productId, course.productId), isNull(entitlements.revokedAt)))
    .limit(1)

  if (enrolled.length === 0) notFound()

  const strategy = (enrolled[0].releaseStrategy as { type?: string } | null)?.type || 'all_unlocked'

  const modules = await db.select().from(courseModules).where(and(eq(courseModules.courseId, courseId), eq(courseModules.isActive, true))).orderBy(asc(courseModules.orderIndex))
  const weeks = await db.select().from(courseWeeks).orderBy(asc(courseWeeks.orderIndex))
  const resources = await db.select().from(courseResources).orderBy(asc(courseResources.orderIndex))
  const progress = await db.select().from(moduleProgress).where(eq(moduleProgress.customerUid, user.uid))
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.resourceId))

  const icon = (type: string) => {
    if (type === 'video') return <Video className="h-4 w-4" />
    if (type === 'pdf') return <FileText className="h-4 w-4" />
    return <LinkIcon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <PlanBadge plan={enrolled[0].planCode} />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Module sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {modules.map((mod, i) => {
            const modWeeks = weeks.filter((w) => w.moduleId === mod.id)
            const modResources = modWeeks.flatMap((w) => resources.filter((r) => r.weekId === w.id))
            const completed = modResources.filter((r) => completedIds.has(r.id)).length
            const total = modResources.length
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <div key={mod.id} className="border rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  {pct === 100 ? <CheckCircle className="h-4 w-4 text-green-500" /> : <span className="text-muted-foreground">#{i + 1}</span>}
                  <span className="font-medium">{mod.title}</span>
                </div>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{completed}/{total} abgeschlossen</p>
              </div>
            )
          })}
        </div>

        {/* Content area */}
        <div className="lg:col-span-3 space-y-4">
          {modules.map((mod, modIdx) => {
            const modWeeks = weeks.filter((w) => w.moduleId === mod.id)

            // Gating: for mentor_gated, module N is locked unless module N-1 is 100%
            let locked = false
            if (strategy === 'mentor_gated' && modIdx > 0) {
              const prevMod = modules[modIdx - 1]
              const prevWeeks = weeks.filter((w) => w.moduleId === prevMod.id)
              const prevResources = prevWeeks.flatMap((w) => resources.filter((r) => r.weekId === w.id))
              const prevCompleted = prevResources.filter((r) => completedIds.has(r.id)).length
              locked = prevResources.length > 0 && prevCompleted < prevResources.length
            }

            return (
              <Card key={mod.id} className={locked ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                    {mod.title}
                  </CardTitle>
                  {locked && <p className="text-xs text-muted-foreground">Schließe das vorherige Modul ab, um dieses freizuschalten.</p>}
                </CardHeader>
                <CardContent>
                  {locked ? (
                    <div className="flex items-center justify-center py-8">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : <>
                  {mod.description && <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>}
                  {modWeeks.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Keine Lektionen konfiguriert.</p>
                  ) : (
                    <div className="space-y-3">
                      {modWeeks.map((week) => {
                        const weekResources = resources.filter((r) => r.weekId === week.id)
                        return (
                          <div key={week.id} className="pl-4 border-l-2 border-muted">
                            <p className="text-sm font-medium mb-2">{week.title}</p>
                            {weekResources.map((res) => (
                              <div key={res.id} className="text-sm py-2 hover:bg-muted/50 rounded px-2 -mx-2">
                                <div className="flex items-center gap-2">
                                  {completedIds.has(res.id) ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> : icon(res.type)}
                                  <span className={`flex-1 ${completedIds.has(res.id) ? 'text-muted-foreground' : ''}`}>{res.title}</span>
                                  {res.duration && <span className="text-xs text-muted-foreground">{Math.ceil(res.duration / 60)} min</span>}
                                  {res.type === 'pdf' && res.url && (
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Download</a>
                                  )}
                                </div>
                                {res.type === 'video' && res.url && (
                                  <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe src={res.url} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen; encrypted-media" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  </>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
