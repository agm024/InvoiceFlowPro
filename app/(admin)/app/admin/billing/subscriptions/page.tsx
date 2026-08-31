import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function SubscriptionsPage() {
  await requireSuperAdmin()

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true, plan: true }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Platform Subscriptions</h1>
        <p className="text-xs text-zinc-500 mt-1">Directory of all active and historical tenant subscriptions.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Billing Cycle</th>
                <th className="px-6 py-4">Lifecycle Status</th>
                <th className="px-6 py-4">Current Period End</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {subscriptions.map(sub => {
                const isCanceledAtPeriodEnd = sub.status === 'canceled' && sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) > new Date()
                
                return (
                  <tr key={sub.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/app/admin/businesses/${sub.companyId}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {sub.company.name}
                      </Link>
                      <p className="text-[10px] text-zinc-400 mt-0.5">ID: {sub.id}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-800 dark:text-zinc-200 font-semibold">{sub.plan.name}</td>
                    <td className="px-6 py-4 capitalize text-zinc-500">{sub.billingInterval}ly</td>
                    <td className="px-6 py-4">
                      {isCanceledAtPeriodEnd ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                          Cancelling at Period End
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                            : sub.status === 'trialing'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                        }`}>
                          {sub.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No subscriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
