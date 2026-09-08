import { notFound } from 'next/navigation'
import prisma from '@/utils/prisma'
import CheckoutClient from './CheckoutClient'
import { getCurrentUser } from '@/lib/auth-context'

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ planId: string }>, searchParams: Promise<{ interval?: string }> }) {
  const { planId } = await params
  const { interval } = await searchParams
  
  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })
  
  if (!plan) notFound()
    
  const user = await getCurrentUser().catch(() => null);
  const company = user?.companyId ? await prisma.company.findUnique({ where: { id: user.companyId } }) : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">SiteRadiant</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure Checkout
          </div>
        </div>
      </header>
      <main className="py-12 px-6 max-w-6xl mx-auto">
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
