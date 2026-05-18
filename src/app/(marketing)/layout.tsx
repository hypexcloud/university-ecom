import { PrestigeHeader } from '@/components/prestige-header'
import { PrestigeFooter } from '@/components/prestige-footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-prestige-black">
      <PrestigeHeader />
      <main className="flex-1">{children}</main>
      <PrestigeFooter />
    </div>
  )
}
