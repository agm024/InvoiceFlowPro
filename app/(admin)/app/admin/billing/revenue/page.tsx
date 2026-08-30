import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"

export default async function RevenuePage() {
  await requireSuperAdmin()

  // Aggregate total revenue
  const totalRevenueResult = await prisma.platformPayment.aggregate({
    _sum: {
      convertedAmountInr: true
    },
    where: {
      status: "SUCCESS"
    }
  })

  // Get international revenue (where currency != INR)
  const intlRevenueResult = await prisma.platformPayment.aggregate({
    _sum: {
      convertedAmountInr: true
    },
    where: {
      status: "SUCCESS",
      originalCurrency: { not: "INR" }
    }
  })

  const totalRevenue = totalRevenueResult._sum.convertedAmountInr || 0
  const intlRevenue = intlRevenueResult._sum.convertedAmountInr || 0

  const recentPayments = await prisma.platformPayment.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { company: true, subscription: { include: { plan: true } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Revenue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-500 text-sm font-medium">Indian Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{(totalRevenue - intlRevenue).toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h3 className="text-zinc-500 text-sm font-medium">International Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{intlRevenue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Original Amount</th>
                <th className="px-6 py-3 font-medium">INR Equivalent</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentPayments.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.company.name}</td>
                  <td className="px-6 py-4">{p.subscription.plan.name}</td>
                  <td className="px-6 py-4">{p.originalCurrency} {p.originalAmount}</td>
                  <td className="px-6 py-4">₹{p.convertedAmountInr.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">{p.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {recentPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No platform payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
