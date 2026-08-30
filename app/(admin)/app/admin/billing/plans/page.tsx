import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { Plus, Star } from "lucide-react"
import Link from "next/link"

export default async function PlansPage() {
  await requireSuperAdmin()

  const plans = await prisma.plan.findMany({
    orderBy: { displayOrder: "asc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Link href="/app/admin/billing/plans/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={16} /> Create Plan
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white dark:bg-zinc-950 border rounded-xl p-6 flex flex-col relative ${plan.isPopular ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
            {plan.isPopular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-blue-500 text-white p-1 rounded-full"><Star size={16} /></div>
              </div>
            )}
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-extrabold">{plan.currency} {plan.monthlyPrice}</span>
              <span className="text-zinc-500">/mo</span>
              <div className="text-sm text-zinc-500 mt-1">{plan.currency} {plan.yearlyPrice} /yr</div>
            </div>
            <ul className="space-y-3 mb-6 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between"><span>Trial Period:</span> <strong>{plan.trialPeriod} days</strong></li>
              <li className="flex justify-between"><span>Users:</span> <strong>{plan.userLimits > 1000000 ? "Unlimited" : plan.userLimits}</strong></li>
              <li className="flex justify-between"><span>Clients:</span> <strong>{plan.clientLimits > 1000000 ? "Unlimited" : plan.clientLimits}</strong></li>
              <li className="flex justify-between"><span>Invoices:</span> <strong>{plan.invoiceLimits > 1000000 ? "Unlimited" : plan.invoiceLimits}</strong></li>
              <li className="flex justify-between"><span>Display Order:</span> <strong>{plan.displayOrder}</strong></li>
            </ul>
            <Link href={`/app/admin/billing/plans/${plan.id}`} className="block text-center w-full py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors">
              Edit Plan
            </Link>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-3 text-center py-12 text-zinc-500 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            No subscription plans created yet.
          </div>
        )}
      </div>
    </div>
  )
}
