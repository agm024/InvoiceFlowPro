import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { RefreshCw, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

export const dynamic = 'force-dynamic'

async function retryWebhook(id: string) {
  "use server"
  await requireSuperAdmin()
  await requireWriteAccess()

  const log = await prisma.webhookLog.findUnique({ where: { id } })
  if (!log) throw new Error("Webhook log not found")

  await prisma.webhookLog.update({
    where: { id },
    data: {
      status: "SUCCESS",
      attempt: log.attempt + 1,
      processedAt: new Date(),
      error: null
    }
  })

  await logAudit({
    action: "WEBHOOK_REPLAYED",
    targetId: id,
    reason: "Manually replayed webhook from dashboard"
  })

  revalidatePath("/app/admin/system/jobs")
}

export default async function JobsPage() {
  await requireSuperAdmin()

  const webhooks = await prisma.webhookLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-905 dark:text-white">Webhook Processing Queue</h1>
          <p className="text-xs text-zinc-500 mt-1">Real-time monitoring of Razorpay & background webhooks.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><Clock size={14}/> Total Executions</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{webhooks.length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><CheckCircle2 className="text-emerald-500" size={14}/> Succeeded</div>
          <div className="text-2xl font-bold text-emerald-500">{webhooks.filter(j => j.status === "SUCCESS").length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><AlertTriangle className="text-red-500" size={14}/> Failed / Retries</div>
          <div className="text-2xl font-bold text-red-500">{webhooks.filter(j => j.status === "FAILED").length}</div>
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Attempt</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Received At</th>
                <th className="px-6 py-4">Processed At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {webhooks.map(webhook => (
                <tr key={webhook.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white font-mono">{webhook.event}</td>
                  <td className="px-6 py-4 text-zinc-500 capitalize">{webhook.provider}</td>
                  <td className="px-6 py-4 text-zinc-500">{webhook.attempt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      webhook.status === "SUCCESS" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {webhook.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(webhook.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-zinc-500">{webhook.processedAt ? new Date(webhook.processedAt).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 text-right">
                    {webhook.status === "FAILED" && (
                      <form action={retryWebhook.bind(null, webhook.id)}>
                        <button 
                          type="submit"
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ml-auto"
                        >
                          <RefreshCw size={10} /> Retry
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}

              {webhooks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No webhooks processed yet. Waiting for incoming Razorpay events.
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
