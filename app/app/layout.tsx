import Sidebar from '@/components/Sidebar'
import AppLayoutClient from '@/components/AppLayoutClient'
import ImpersonationBanner from '@/components/ImpersonationBanner'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ImpersonationBanner />
      <AppLayoutClient sidebar={<Sidebar />}>
        {children}
      </AppLayoutClient>
    </>
  )
}
