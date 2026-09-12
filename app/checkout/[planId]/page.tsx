import { notFound } from 'next/navigation'
import prisma from '@/utils/prisma'
import CheckoutClient from './CheckoutClient'
import { getCurrentUser } from '@/lib/auth-context'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>
  searchParams: Promise<{ interval?: string }>
}) {
  const { planId }   = await params
  const { interval } = await searchParams

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan) notFound()

  const user    = await getCurrentUser().catch(() => null)
  const company = user?.companyId
    ? await prisma.company.findUnique({ where: { id: user.companyId } })
    : null

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F7F6F2', color: '#151515' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(247,246,242,0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(21,21,21,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#151515' }}>
              <span className="font-black text-sm" style={{ color: '#20B26B' }}>I</span>
            </div>
            <span className="font-black text-sm tracking-tight" style={{ color: '#151515' }}>
              FlowRadiant<span style={{ color: '#20B26B' }}>Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#9B9B96' }}>
            <Lock size={12} />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="py-10 px-6 max-w-6xl mx-auto">
        <CheckoutClient
          plan={plan}
          isAnnual={interval !== 'month'}
          user={user}
          company={company}
        />
      </main>
    </div>
  )
}

