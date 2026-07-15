import Sidebar from '@/components/Sidebar'
import AppLayoutClient from '@/components/AppLayoutClient'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayoutClient sidebar={<Sidebar />}>
      {children}
    </AppLayoutClient>
  )
}
