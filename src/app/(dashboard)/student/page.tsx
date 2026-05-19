import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import {
  entitlements, plans, products, sessions, tickets,
  notifications, communityPosts, customers, moduleProgress,
  affiliateLinks, affiliateReferrals,
} from '@/lib/server/db/schema'
import { eq, isNull, isNotNull, count, gte, and, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { ProductCard } from '@/components/dashboard/product-card'
import { SessionCard } from '@/components/dashboard/session-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { UpgradeCard } from '@/components/dashboard/upgrade-card'
import {
  BookOpen, Calendar, Ticket, Award, ArrowRight, MessageSquare,
  Sparkles, CheckCircle, User, Zap, Video, Users,
} from 'lucide-react'

export default async function StudentDashboard() {
  const user = await requireAuth()
  const uid = user.uid

  // Sequential queries (postgres.js with prepare:false can't handle parallel on single connection)
  const activeEntitlements = await db.select({
    id: entitlements.id, planCode: plans.code, productTitle: products.title,
    productSlug: products.slug, productKind: products.kind, grantedAt: entitlements.grantedAt,
  }).from(entitlements)
    .innerJoin(plans, eq(entitlements.planId, plans.id))
    .innerJoin(products, eq(plans.productId, products.id))
    .where(and(eq(entitlements.customerUid, uid), isNull(entitlements.revokedAt)))

  const upcomingSessions = await db.select({
    id: sessions.id, scheduledAt: sessions.scheduledAt, type: sessions.type,
    status: sessions.status, meetingUrl: sessions.meetingUrl,
    mentorFirstName: customers.firstName, mentorLastName: customers.lastName,
  }).from(sessions)
    .innerJoin(customers, eq(sessions.mentorUid, customers.uid))
    .where(and(eq(sessions.customerUid, uid), gte(sessions.scheduledAt, new Date())))
    .orderBy(sessions.scheduledAt)

  const openTicketResult = await db.select({ value: count() }).from(tickets)
    .where(and(eq(tickets.customerUid, uid), eq(tickets.status, 'offen')))

  const unreadNotifResult = await db.select({ value: count() }).from(notifications)
    .where(and(eq(notifications.recipientUid, uid), isNull(notifications.readAt)))

  const recentPosts = await db.select({ id: communityPosts.id, title: communityPosts.title, category: communityPosts.category })
    .from(communityPosts).where(isNotNull(communityPosts.publishedAt))
    .orderBy(desc(communityPosts.publishedAt))

  const affiliateData = await db.select({ id: affiliateLinks.id, code: affiliateLinks.code })
    .from(affiliateLinks).where(eq(affiliateLinks.customerUid, uid))

  const progressData = await db.select({ value: count() }).from(moduleProgress)
    .where(and(eq(moduleProgress.customerUid, uid), eq(moduleProgress.completed, true)))

  const openTickets = openTicketResult[0]?.value ?? 0
  const unreadNotifs = unreadNotifResult[0]?.value ?? 0
  const completedResources = progressData[0]?.value ?? 0
  const hasEntitlements = activeEntitlements.length > 0
  const hasProgress = completedResources > 0
  const isAffiliate = affiliateData.length > 0

  // ============ STATE A: No entitlements ============
  if (!hasEntitlements) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Willkommen bei University Ecom</h1>
          <p className="text-muted-foreground mt-1">Du hast aktuell noch keinen Kurs ausgewählt.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'AI-Automatisierung Kurs', desc: 'Lerne AI für dein Business', href: '/courses/ai', icon: Sparkles, color: 'bg-purple-50 text-purple-700' },
            { title: 'EU-Dropshipping Kurs', desc: 'Baue dein Dropshipping Business', href: '/courses/dropshipping', icon: Zap, color: 'bg-blue-50 text-blue-700' },
            { title: 'Creator Programm', desc: 'TikTok & YouTube Coaching', href: '/creator', icon: Video, color: 'bg-pink-50 text-pink-700' },
            { title: 'Erstgespräch', desc: 'Kostenlose Beratung buchen', href: '/intake', icon: Users, color: 'bg-amber-50 text-amber-700' },
          ].map((cta) => (
            <Link key={cta.href} href={cta.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className={`h-10 w-10 rounded-lg ${cta.color} flex items-center justify-center mb-3`}>
                    <cta.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">{cta.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cta.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {recentPosts.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Community Highlights</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentPosts.map((p) => (
                  <Link key={p.id} href={`/student/community/${p.id}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                    <span className="text-sm font-medium">{p.title}</span>
                    <Badge variant="outline" className="capitalize">{p.category}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ============ STATE C: Has entitlement, zero progress ============
  if (!hasProgress) {
    const onboarding = [
      { done: true, label: 'Konto erstellt', icon: CheckCircle },
      { done: !!user.customer.discordUsername, label: 'Discord verbunden', icon: MessageSquare, href: '/student/profil/discord' },
      { done: false, label: 'Ersten Kurs starten', icon: BookOpen, href: '/student/kurse' },
      { done: false, label: 'Erstes Modul abschließen', icon: Award },
      { done: false, label: 'Support-Ticket erstellen (bei Fragen)', icon: Ticket, href: '/student/support' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Willkommen, {user.customer.firstName}!</h1>
          <p className="text-muted-foreground mt-1">Schön, dass du dabei bist. Starte jetzt mit deinem ersten Kurs.</p>
        </div>

        {/* Main course CTA */}
        <div className="grid gap-4 md:grid-cols-2">
          {activeEntitlements.map((e) => (
            <ProductCard key={e.id} title={e.productTitle} planCode={e.planCode} href="/student/kurse" />
          ))}
        </div>

        {/* Onboarding checklist */}
        <Card>
          <CardHeader><CardTitle>Dein Startplan</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onboarding.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {step.done ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
                  )}
                  {step.href ? (
                    <Link href={step.href} className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'font-medium hover:text-primary'}`}>
                      {step.label}
                    </Link>
                  ) : (
                    <span className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'font-medium'}`}>{step.label}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============ STATE B: Has entitlements + progress ============
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Willkommen zurück, {user.customer.firstName}!</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kurse</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeEntitlements.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abgeschlossene Module</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{completedResources}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anstehende Termine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{upcomingSessions.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ungelesen</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{unreadNotifs}</div></CardContent>
        </Card>
      </div>

      {/* Meine Kurse */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meine Kurse</CardTitle>
          <Link href="/student/kurse" className="text-sm text-primary hover:underline">Alle ansehen</Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {activeEntitlements.filter((e) => e.productKind === 'course').map((e) => (
              <ProductCard key={e.id} title={e.productTitle} planCode={e.planCode} href="/student/kurse" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade prompt for Fast plan holders */}
      {activeEntitlements.filter((e) => e.planCode === 'fast').map((e) => (
        <UpgradeCard key={`upgrade-${e.id}`} currentPlan={e.planCode} productSlug={e.productSlug} />
      ))}

      {/* Nächste Termine */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nächste Termine</CardTitle>
            <Link href="/student/termine" className="text-sm text-primary hover:underline">Alle ansehen</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingSessions.map((s) => (
              <SessionCard
                key={s.id}
                date={s.scheduledAt}
                mentorName={`${s.mentorFirstName} ${s.mentorLastName}`}
                type={s.type}
                status={s.status}
                meetingUrl={s.meetingUrl}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Community Highlights */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Community</CardTitle>
            <Link href="/student/community" className="text-sm text-primary hover:underline">Alle ansehen</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPosts.map((p) => (
                <Link key={p.id} href={`/student/community/${p.id}`} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors">
                  <span className="text-sm">{p.title}</span>
                  <Badge variant="outline" className="capitalize text-xs">{p.category}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affiliate widget */}
      {isAffiliate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Affiliate</CardTitle>
            <Link href="/student/affiliate" className="text-sm text-primary hover:underline">Dashboard öffnen</Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Dein Empfehlungslink: <code className="bg-muted px-2 py-0.5 rounded text-xs">{typeof window !== 'undefined' ? window.location.origin : ''}/?ref={affiliateData[0].code}</code></p>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { href: '/student/kurse', icon: BookOpen, label: 'Kursinhalte' },
          { href: '/student/termine', icon: Calendar, label: 'Termine' },
          { href: '/student/support', icon: Ticket, label: 'Support' },
          { href: '/student/profil', icon: User, label: 'Profil' },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="border rounded-lg p-4 text-center hover:bg-accent transition-colors">
            <link.icon className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
