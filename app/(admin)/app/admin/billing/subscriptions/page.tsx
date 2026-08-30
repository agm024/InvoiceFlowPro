import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import Link from "next/link"

export default async function SubscriptionsPage() {
  await requireSuperAdmin()

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true, plan: true }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Subscriptions</h1>
      
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Current Period End</th>
                <th className="px-6 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4">
                    <Link href={`/app/admin/businesses/${sub.companyId}`} className="text-blue-600 hover:underline font-medium">
                      {sub.company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{sub.plan.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{sub.currentPeriodEnd ? sub.currentPeriodEnd.toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-zinc-500">{sub.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No subscriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
