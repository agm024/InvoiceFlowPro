import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminBillingPlansPage() {
  await requireSuperAdmin()

  const plans = await prisma.plan.findMany({
    orderBy: { displayOrder: 'asc' }
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing Plans</h1>
          <p className="text-muted-foreground">Manage your SaaS subscription plans</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border bg-white dark:bg-zinc-950 text-card-foreground shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">{plan.name}</h3>
              <p className="text-3xl font-bold">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Users: {plan.userLimits === 0 ? 'Unlimited' : plan.userLimits}</li>
              <li>Clients: {plan.clientLimits === 0 ? 'Unlimited' : plan.clientLimits}</li>
              <li>Invoices: {plan.invoiceLimits === 0 ? 'Unlimited' : plan.invoiceLimits}</li>
            </ul>
            <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
              Edit Plan
            </button>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full p-8 text-center border rounded-xl border-dashed">
            <p className="text-muted-foreground">No plans found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
