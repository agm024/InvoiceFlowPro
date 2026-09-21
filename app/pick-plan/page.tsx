import prisma from '@/utils/prisma'
import { OnboardingPlansClient } from './OnboardingPlansClient'

export default async function OnboardingPlansPage() {
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Choose Your Plan</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Select the plan that fits your business needs. You can always change this later.</p>
        </div>
        
        <OnboardingPlansClient plans={plans} />
      </div>
    </div>
  )
}
