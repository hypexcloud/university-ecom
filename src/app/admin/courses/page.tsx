import { redirect } from 'next/navigation'

// Server-side redirect - this happens during build/SSR
export default function CoursesPage() {
  // Use Next.js redirect instead of client-side router
  redirect('/admin/termine')
}
