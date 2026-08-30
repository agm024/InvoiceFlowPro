import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import Link from "next/link"

export default async function PaymentsPage() {
  await requireSuperAdmin()

  const payments = await prisma.platformPayment.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true, subscription: { include: { plan: true } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Payments</h1>
      
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Txn ID</th>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Original Amount</th>
                <th className="px-6 py-3 font-medium">INR Equivalent</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                  <td className="px-6 py-4">
                    <Link href={`/app/admin/businesses/${p.companyId}`} className="text-blue-600 hover:underline">
                      {p.company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{p.subscription.plan.name}</td>
                  <td className="px-6 py-4">{p.originalCurrency} {p.originalAmount}</td>
                  <td className="px-6 py-4 font-medium">₹{p.convertedAmountInr.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{p.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">No platform payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
