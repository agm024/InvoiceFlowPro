import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { PaymentsTableClient } from "./PaymentsTableClient"

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  await requireSuperAdmin()

  const payments = await prisma.platformPayment.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true, subscription: { include: { plan: true } } }
  })

  // Format to pass to client component
  const formattedPayments = payments.map(p => ({
    id: p.id,
    gatewayTransactionId: p.gatewayTransactionId,
    companyId: p.companyId,
    companyName: p.company.name,
    planName: p.subscription.plan.name,
    originalAmount: p.originalAmount,
    originalCurrency: p.originalCurrency,
    convertedAmountInr: p.convertedAmountInr,
    status: p.status,
    createdAt: p.createdAt.toISOString()
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Platform Payments</h1>
        <p className="text-xs text-zinc-500 mt-1">Audit log of all platform subscription checkout payments.</p>
      </div>

      <PaymentsTableClient payments={formattedPayments} />
    </div>
  )
}
