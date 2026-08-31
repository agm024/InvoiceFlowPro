import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { Globe, RefreshCw, Activity, AlertCircle, Play } from "lucide-react"

export const dynamic = 'force-dynamic'

// Server Action to simulate a webhook delivery
async function simulateWebhook() {
  "use server"
  await requireSuperAdmin()
  await requireWriteAccess()

  const payload = {
    entity: "event",
    account_id: "acc_Nl9W2z4n",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: "pay_XYZ" + Math.random().toString(36).substring(2, 7).toUpperCase(),
          amount: 290000,
          currency: "INR",
          status: "captured",
          order_id: "order_mock123",
          email: "tenant@example.com",
          contact: "+919999999999"
        }
      }
    },
    created_at: Math.floor(Date.now() / 1000)
  }

  await prisma.webhookLog.create({
    data: {
      provider: "RAZORPAY",
      event: "payment.captured",
      status: "SUCCESS",
      attempt: 1,
      payload: JSON.stringify(payload),
      response: "Status 200 OK - Processed successfully",
      processedAt: new Date()
    }
  })

  await logAudit({
    action: "WEBHOOK_SIMULATED",
    reason: "Simulated payment.captured event verification"
  })

  revalidatePath("/app/admin/system/webhooks")
}

// Server Action to retry webhook
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
      response: "Replayed at " + new Date().toISOString() + " - Success",
      processedAt: new Date(),
      error: null
    }
  })

  await logAudit({
    action: "WEBHOOK_REPLAYED",
    targetId: id,
    reason: "Manually replayed webhook from dashboard"
  })

  revalidatePath("/app/admin/system/webhooks")
}

export default async function WebhooksPage() {
  await requireSuperAdmin()

  const logs = await prisma.webhookLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-905 dark:text-white">Webhook Delivery Logs</h1>
          <p className="text-xs text-zinc-500 mt-1">Telemetry log monitoring incoming webhooks from external API systems.</p>
        </div>
        <form action={simulateWebhook}>
          <button 
            type="submit"
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
          >
            <Play size={12} /> Simulate Webhook Event
          </button>
        </form>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><Globe size={14}/> Total Webhooks</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{logs.length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><Activity size={14}/> Successful Hooks</div>
          <div className="text-2xl font-bold text-emerald-500">{logs.filter(l => l.status === "SUCCESS").length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><AlertCircle size={14}/> Failed Hooks</div>
          <div className="text-2xl font-bold text-red-500">{logs.filter(l => l.status === "FAILED").length}</div>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Event Code</th>
                <th className="px-6 py-4">Attempts</th>
                <th className="px-6 py-4">Response Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{log.provider}</td>
                  <td className="px-6 py-4 font-mono font-bold text-zinc-800 dark:text-zinc-200">{log.event}</td>
                  <td className="px-6 py-4 text-zinc-500">{log.attempt}</td>
                  <td className="px-6 py-4 text-zinc-500 max-w-xs truncate" title={log.response || ""}>
                    {log.response || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === "SUCCESS" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <form action={retryWebhook.bind(null, log.id)}>
                      <button 
                        type="submit" 
                        className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ml-auto"
                      >
                        <RefreshCw size={10} /> Replay
                      </button>
                    </form>
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No webhooks registered. Click "Simulate Webhook Event" above to create one.
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
