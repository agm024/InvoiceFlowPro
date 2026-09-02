import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export default async function TenantSupportPage() {
  const { companyId } = await requireCompany()

  const tickets = await prisma.ticket.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' }
  })

  async function createTicket(formData: FormData) {
    'use server'
    const subject = formData.get('subject') as string
    const priority = formData.get('priority') as string
    
    if (!subject) return

    const { companyId } = await requireCompany()
    await prisma.ticket.create({
      data: {
        subject,
        priority: priority || 'MEDIUM',
        companyId,
        status: 'OPEN'
      }
    })
    
    revalidatePath('/app/support')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-zinc-500 mt-2">Raise a ticket with our support team if you need assistance.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Create a new ticket</h2>
        <form action={createTicket} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Subject / Issue</label>
            <input 
              name="subject"
              type="text" 
              required 
              placeholder="e.g., Cannot export my invoices"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select 
              name="priority"
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors">
            Submit Ticket
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Subject</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Priority</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{ticket.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {ticket.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    You haven't raised any support tickets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
          {tickets.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500">
              You haven't raised any support tickets yet.
            </div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="p-4 flex flex-col gap-3">
                <div className="font-medium text-foreground text-base leading-tight">{ticket.subject}</div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {ticket.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
