import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user && (session.user as any).companyId) {
    redirect('/app')
  }
  return children
}
