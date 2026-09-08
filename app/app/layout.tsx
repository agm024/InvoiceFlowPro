import Sidebar from '@/components/Sidebar'
import AppLayoutClient from '@/components/AppLayoutClient'
import ImpersonationBanner from '@/components/ImpersonationBanner'
import { getCurrentUser } from '@/lib/auth-context'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <>
      <ImpersonationBanner />
      <AppLayoutClient sidebar={<Sidebar />} user={user}>
        {children}
      </AppLayoutClient>
    </>
  )
}
