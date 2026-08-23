import { requireSuperAdmin } from '@/lib/auth-context'

export default async function AdminBillingPaymentsPage() {
  await requireSuperAdmin()

  // Mock data for SaaS payments
  const payments = [
    { id: 'txn_1001', company: 'Acme Corp', amount: 99.0, gateway: 'Stripe', status: 'Success', date: '2026-08-20' },
    { id: 'txn_1002', company: 'Globex', amount: 299.0, gateway: 'Razorpay', status: 'Success', date: '2026-08-21' },
    { id: 'txn_1003', company: 'Soylent Corp', amount: 49.0, gateway: 'Stripe', status: 'Failed', date: '2026-08-21' },
    { id: 'txn_1004', company: 'Initech', amount: 99.0, gateway: 'Razorpay', status: 'Pending', date: '2026-08-22' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SaaS Payments</h1>
        <p className="text-muted-foreground">View recent subscription payments across all companies.</p>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-950 text-card-foreground shadow-sm">
        <div className="p-0">
          <div className="w-full overflow-auto">
            <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gateway</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {payments.map((txn) => (
                  <tr key={txn.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{txn.id}</td>
                    <td className="p-4 align-middle">{txn.company}</td>
                    <td className="p-4 align-middle">${txn.amount.toFixed(2)}</td>
                    <td className="p-4 align-middle">{txn.gateway}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        txn.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        txn.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{new Date(txn.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
