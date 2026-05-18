import { Badge } from '@/components/ui/badge'

const planColors: Record<string, string> = {
  fast: 'bg-blue-100 text-blue-800',
  business: 'bg-amber-100 text-amber-800',
  infinity: 'bg-purple-100 text-purple-800',
  tiktok: 'bg-pink-100 text-pink-800',
  youtube: 'bg-red-100 text-red-800',
}

export function PlanBadge({ plan }: { plan: string }) {
  return (
    <Badge variant="outline" className={`${planColors[plan] || ''} capitalize`}>
      {plan}
    </Badge>
  )
}
