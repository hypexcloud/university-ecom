import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PlanBadge } from './plan-badge'
import { ArrowRight } from 'lucide-react'

interface ProductCardProps {
  title: string
  planCode: string
  progressPct?: number
  href: string
  lastAccessed?: string
}

export function ProductCard({ title, planCode, progressPct = 0, href, lastAccessed }: ProductCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium">{title}</h3>
              <PlanBadge plan={planCode} />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
          </div>
          <Progress value={progressPct} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progressPct}% abgeschlossen</span>
            {lastAccessed && <span>Zuletzt: {lastAccessed}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
