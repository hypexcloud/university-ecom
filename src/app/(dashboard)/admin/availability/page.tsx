import { redirect } from 'next/navigation'

// Availability management moved to mentor portal
export default function AvailabilityRedirect() {
  redirect('/mentor/availability')
}
