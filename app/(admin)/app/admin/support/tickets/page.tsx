import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { updateTicketStatus } from './actions'

export default async function TicketsPage() {
  await requireSuperAdmin()

  const tickets = await prisma.ticket.findMany({
    include: {
      company: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-zinc-500 mt-2">Manage customer support tickets across all companies.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="whitespace-nowrap w-full text-sm text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium border-b border-zinc-200 dark:border-zinc-900">
            <tr>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                  {ticket.company?.name || <span className="text-zinc-400 italic">Unknown</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    ticket.status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                    ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' :
                    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                    ticket.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {ticket.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={updateTicketStatus} className="flex items-center justify-end gap-2">
                    <input type="hidden" name="id" value={ticket.id} />
                    <select
                      name="status"
                      defaultValue={ticket.status}
                      className="text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1"
                    >
                      <option value="OPEN">Open</option>
                      <option value="PENDING">Pending</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    <button type="submit" className="px-3 py-1 text-xs font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-md hover:opacity-90 transition">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No support tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
