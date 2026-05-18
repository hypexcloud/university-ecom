import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardNotFound() {
  return (
    <div className="dashboard-shell min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">Seite nicht gefunden</h2>
        <p className="text-gray-500 max-w-md">
          Diese Seite existiert nicht in deinem Dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/student">Zum Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/student/support">Support kontaktieren</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
