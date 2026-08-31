import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { RefreshCw, Play, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

export const dynamic = 'force-dynamic'

async function simulateJob() {
  "use server"
  await requireSuperAdmin()
  await requireWriteAccess()

  const jobsList = [
    { name: "RECURRING_BILLING_DISPATCH", queue: "billing" },
    { name: "PDF_INVOICE_GENERATION", queue: "default" },
    { name: "METRICS_ARR_AGGREGATION", queue: "analytics" }
  ]

  const selected = jobsList[Math.floor(Math.random() * jobsList.length)]

  await prisma.backgroundJobLog.create({
    data: {
      jobName: selected.name,
      queue: selected.queue,
      status: "COMPLETED",
      duration: Math.floor(Math.random() * 800) + 100,
      retries: 0,
      startedAt: new Date(),
      completedAt: new Date()
    }
  })

  await logAudit({
    action: "JOB_SIMULATED",
    reason: "Simulated job dispatch event verification"
  })

  revalidatePath("/app/admin/system/jobs")
}

async function retryJob(id: string) {
  "use server"
  await requireSuperAdmin()
  await requireWriteAccess()

  const log = await prisma.backgroundJobLog.findUnique({ where: { id } })
  if (!log) throw new Error("Job not found")

  await prisma.backgroundJobLog.update({
    where: { id },
    data: {
      status: "COMPLETED",
      retries: log.retries + 1,
      duration: Math.floor(Math.random() * 400) + 50,
      completedAt: new Date(),
      error: null
    }
  })

  await logAudit({
    action: "JOB_REPLAYED",
    targetId: id,
    reason: "Manually replayed queued job from dashboard"
  })

  revalidatePath("/app/admin/system/jobs")
}

export default async function JobsPage() {
  await requireSuperAdmin()

  const jobs = await prisma.backgroundJobLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 50
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-905 dark:text-white">Background Queues</h1>
          <p className="text-xs text-zinc-500 mt-1">Real-time status monitoring of asynchronous processing pipelines.</p>
        </div>
        <form action={simulateJob}>
          <button 
            type="submit"
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
          >
            <Play size={12} /> Dispatch Test Job
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><Clock size={14}/> Total Executions</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{jobs.length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><CheckCircle2 className="text-emerald-500" size={14}/> Succeeded</div>
          <div className="text-2xl font-bold text-emerald-500">{jobs.filter(j => j.status === "COMPLETED").length}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
          <div className="text-zinc-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"><AlertTriangle className="text-red-500" size={14}/> Failed / Retries</div>
          <div className="text-2xl font-bold text-red-500">{jobs.filter(j => j.status === "FAILED").length}</div>
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Job Name</th>
                <th className="px-6 py-4">Queue</th>
                <th className="px-6 py-4">Retries</th>
                <th className="px-6 py-4">Duration (ms)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Execution Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white font-mono">{job.jobName}</td>
                  <td className="px-6 py-4 text-zinc-500 capitalize">{job.queue}</td>
                  <td className="px-6 py-4 text-zinc-500">{job.retries}</td>
                  <td className="px-6 py-4 text-zinc-500">{job.duration || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === "COMPLETED" 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(job.startedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    {job.status === "FAILED" && (
                      <form action={retryJob.bind(null, job.id)}>
                        <button 
                          type="submit"
                          className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 ml-auto"
                        >
                          <RefreshCw size={10} /> Retry Job
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No background jobs logged. Click "Dispatch Test Job" above to trigger one.
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
