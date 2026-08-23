import prisma from '@/utils/prisma'
import { requireSuperAdmin } from '@/lib/auth-context'
import { AlertCircle, Clock } from 'lucide-react'

export default async function AuditLogsPage() {
  await requireSuperAdmin()

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  // Fetch related entities to map CUIDs to human-readable names
  const adminIds = [...new Set(logs.map(l => l.adminId))]
  const companyIds = [...new Set(logs.map(l => l.companyId).filter(Boolean) as string[])]
  
  const [admins, companies] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: adminIds } }, select: { id: true, name: true, email: true } }),
    prisma.company.findMany({ where: { id: { in: companyIds } }, select: { id: true, name: true } })
  ])

  const adminMap = new Map(admins.map(a => [a.id, a.name || a.email]))
  const companyMap = new Map(companies.map(c => [c.id, c.name]))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-zinc-500 mt-2">Immutable record of critical system and security events.</p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-900">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Action</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Admin</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Target/Company</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">IP Address</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {logs.map(log => {
              const adminName = adminMap.get(log.adminId) || log.adminId
              const targetName = log.companyId ? (companyMap.get(log.companyId) || log.companyId) : (log.targetId || '-')
              
              return (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">{adminName}</span>
                    <br/>
                    <span className="font-mono text-[10px] text-zinc-400">{log.adminId}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium">{targetName}</span>
                    {log.companyId && (
                      <>
                        <br/>
                        <span className="font-mono text-[10px] text-zinc-400">{log.companyId}</span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 flex items-center gap-2">
                    <Clock size={14} />
                    {log.createdAt.toLocaleString()}
                  </td>
                </tr>
              )
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <AlertCircle className="mx-auto mb-2 text-zinc-400" size={24} />
                  No audit logs found.
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
