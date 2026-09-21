import Sidebar from '@/components/Sidebar'
import AppLayoutClient from '@/components/AppLayoutClient'
import ImpersonationBanner from '@/components/ImpersonationBanner'
import TrialExpiredPopup from '@/components/TrialExpiredPopup'
import { getCurrentUser } from '@/lib/auth-context'
import prisma from '@/utils/prisma'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  let isTrialExpired = false;
  if (user?.companyId) {
    const sub = await prisma.subscription.findUnique({ where: { companyId: user.companyId } })
    if (sub && sub.planSource === 'TRIAL' && sub.expiresAt && sub.expiresAt < new Date()) {
      isTrialExpired = true;
    }
  }

  return (
    <>
      <ImpersonationBanner />
      <TrialExpiredPopup isExpired={isTrialExpired} />
      <AppLayoutClient sidebar={<Sidebar user={user} />} user={user}>
        {children}
      </AppLayoutClient>
    </>
  )
}
