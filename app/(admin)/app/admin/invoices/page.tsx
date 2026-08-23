import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import StatusBadge from '@/components/StatusBadge'

export default async function GlobalInvoicesPage() {
  await requireSuperAdmin()

  const invoices = await prisma.invoice.findMany({
    include: {
      company: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  const totalInvoices = invoices.length
  const totalValue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Invoicing Monitor</h1>
        <p className="text-zinc-500 mt-2">Monitor all invoices across all businesses on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Invoices Generated</p>
          <p className="text-4xl font-bold mt-2">{totalInvoices.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Invoice Value</p>
          <p className="text-4xl font-bold mt-2">
            ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-900">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No invoices found on the platform yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/app/admin/businesses/${inv.companyId}`}
                        className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                      >
                        {inv.company.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {inv.currency} {inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {format(new Date(inv.createdAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
