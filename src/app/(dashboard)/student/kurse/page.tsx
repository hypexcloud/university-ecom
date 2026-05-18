import { db } from '@/lib/server/db'
import { entitlements, plans, products, courses, moduleProgress, courseResources } from '@/lib/server/db/schema'
import { eq, and, isNull, count } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { ProductCard } from '@/components/dashboard/product-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { BookOpen } from 'lucide-react'

export default async function KursePage() {
  const user = await requireAuth()

  const enrolled = await db
    .select({
      entitlementId: entitlements.id,
      planCode: plans.code,
      productTitle: products.title,
      courseId: courses.id,
      courseSlug: courses.slug,
    })
    .from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .innerJoin(products, eq(plans.productId, products.id))
    .innerJoin(courses, eq(courses.productId, products.id))
    .where(and(eq(entitlements.customerUid, user.uid), isNull(entitlements.revokedAt)))

  if (enrolled.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meine Kurse</h1>
        <EmptyState icon={BookOpen} title="Noch keine Kurse" description="Du hast noch keinen Kurs freigeschaltet." action={{ label: 'Kurse entdecken', href: '/courses' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Kurse</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {enrolled.map((e) => (
          <ProductCard
            key={e.entitlementId}
            title={e.productTitle}
            planCode={e.planCode}
            href={`/student/kurse/${e.courseId}`}
          />
        ))}
      </div>
    </div>
  )
}
