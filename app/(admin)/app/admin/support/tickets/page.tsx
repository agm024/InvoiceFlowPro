import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { TicketsTableClient } from './TicketsTableClient'

export const dynamic = 'force-dynamic'

export default async function TicketsPage() {
  await requireSuperAdmin()

  const tickets = await prisma.ticket.findMany({
    include: {
      company: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Format to pass to client component
  const formattedTickets = tickets.map(t => ({
    id: t.id,
    subject: t.subject,
    status: t.status,
    priority: t.priority,
    companyId: t.companyId,
    companyName: t.company?.name || "Unknown Company",
    createdAt: t.createdAt.toISOString()
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Support Tickets</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage and resolve customer support tickets across all companies.</p>
      </div>

      <TicketsTableClient tickets={formattedTickets} />
    </div>
  )
}
