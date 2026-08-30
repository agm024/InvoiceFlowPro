import { requireSuperAdmin } from "@/lib/auth-context"
import prisma from "@/utils/prisma"
import { resolveTicket } from "./actions"
import { CheckCircle2 } from "lucide-react"

export default async function AdminSupportPage() {
  await requireSuperAdmin()

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { company: true }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <p className="text-zinc-500 mt-1">Manage and resolve issues reported by tenants.</p>
      </div>
      
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Business</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Subject</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Priority</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Date</th>
                <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{ticket.company?.name || "Unknown"}</td>
                  <td className="px-6 py-4">{ticket.subject}</td>
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
                  <td className="px-6 py-4 text-right">
                    {ticket.status === 'OPEN' ? (
                      <form action={async () => {
                        'use server';
                        await resolveTicket(ticket.id);
                      }}>
                        <button type="submit" className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1 justify-end w-full">
                          <CheckCircle2 size={14} /> Resolve
                        </button>
                      </form>
                    ) : (
                      <span className="text-zinc-400 text-xs">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
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
