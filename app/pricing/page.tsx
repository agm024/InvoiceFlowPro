import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import prisma from '@/utils/prisma'
import { PricingClient } from './PricingClient'

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { displayOrder: 'asc' }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Transparent pricing for every business</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">No hidden fees. Pay only for what you need. Upgrade or downgrade at any time.</p>
        </div>
        
        <PricingClient plans={plans} />
      </main>
      <MarketingFooter />
    </div>
  )
}
