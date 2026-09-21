import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import prisma from '@/utils/prisma'
import { PricingClient } from './PricingClient'
import { cookies } from 'next/headers'

export default async function PricingPage() {
  const token = (await cookies()).get('auth_token')?.value
  let user = { companyId: 'test' }; // mock user for testing
let plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' }
  })

  // Put popular plan in the middle
  const popularIndex = plans.findIndex(p => p.isPopular);
  if (popularIndex !== -1 && plans.length >= 3) {
    const popularPlan = plans.splice(popularIndex, 1)[0];
    const middleIndex = Math.floor(plans.length / 2);
    plans.splice(middleIndex, 0, popularPlan);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Transparent pricing for every business</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">No hidden fees. Pay only for what you need. Upgrade or downgrade at any time.</p>
        </div>
        
        <PricingClient plans={plans} user={user} />
      </main>
      <MarketingFooter />
    </div>
  )
}
