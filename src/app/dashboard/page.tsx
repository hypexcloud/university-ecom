import { redirect } from 'next/navigation'

// Legacy route — redirect to student dashboard
export default function DashboardRedirect() {
  redirect('/student')
}
