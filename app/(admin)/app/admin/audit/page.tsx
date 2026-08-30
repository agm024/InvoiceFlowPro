import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"

export default async function AuditLogsPage() {
  await requireSuperAdmin()

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <p className="text-sm text-zinc-500">Immutable record of sensitive platform actions.</p>
      
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Admin ID</th>
                <th className="px-6 py-3 font-medium">Target / Company</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 text-zinc-500">{log.createdAt.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold">{log.action}</td>
                  <td className="px-6 py-4">{log.adminId}</td>
                  <td className="px-6 py-4">{log.targetId || log.companyId || "-"}</td>
                  <td className="px-6 py-4 font-mono text-xs">{log.ipAddress || "unknown"}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No audit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
