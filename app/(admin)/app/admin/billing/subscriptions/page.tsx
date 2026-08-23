import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'

export default async function AdminBillingSubscriptionsPage() {
  await requireSuperAdmin()

  const subscriptions = await prisma.subscription.findMany({
    include: {
      company: true,
      plan: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">View all active and inactive subscriptions across companies.</p>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-950 text-card-foreground shadow-sm">
        <div className="p-0">
          <div className="w-full overflow-auto">
            <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Plan</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Period End</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{sub.company?.name || 'Unknown'}</td>
                    <td className="p-4 align-middle">{sub.plan?.name || 'Unknown'}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${sub.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
