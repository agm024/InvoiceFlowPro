import prisma from "@/utils/prisma"
import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-context"
import Link from "next/link"
import { 
  Building2, CreditCard, Activity, Users, AlertTriangle, ShieldAlert,
  LifeBuoy, Mail, Terminal, ArrowUpRight, BarChart3, TrendingUp,
  HelpCircle, Globe
} from "lucide-react"
import { subDays, format, startOfDay } from "date-fns"
import DashboardCharts from "./DashboardCharts"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireSuperAdmin()

  // 1. BUSINESS METRICS
  const totalBusinesses = await prisma.company.count()
  const activeBusinesses = await prisma.company.count({ where: { status: "ACTIVE" } })
  const newBusinesses30d = await prisma.company.count({
    where: { createdAt: { gte: subDays(new Date(), 30) } }
  })
  const suspendedBusinesses = await prisma.company.count({ where: { status: "SUSPENDED" } })
  const activeUsers = await prisma.user.count()
  const newUsers30d = await prisma.user.count({
    where: { createdAt: { gte: subDays(new Date(), 30) } }
  })

  // 2. SUBSCRIPTION METRICS
  const activeSubs = await prisma.subscription.findMany({
    where: { status: "active" },
    include: { plan: true }
  })

  // Calculate MRR / ARR from active subscriptions
  let mrr = 0
  activeSubs.forEach(sub => {
    const planPrice = sub.billingInterval === "year" ? sub.plan.yearlyPrice / 12 : sub.plan.monthlyPrice
    mrr += planPrice
  })
  const arr = mrr * 12

  const activeSubscriptionsCount = activeSubs.length
  const trialSubscriptionsCount = await prisma.subscription.count({ where: { status: "trialing" } })
  const cancelledSubscriptionsCount = await prisma.subscription.count({ where: { status: "canceled" } })
  const pastDueSubscriptionsCount = await prisma.subscription.count({ where: { status: "past_due" } })
  
  // Churn calculations
  const churnRate = activeSubscriptionsCount > 0 
    ? (cancelledSubscriptionsCount / (activeSubscriptionsCount + cancelledSubscriptionsCount)) * 100 
    : 0

  const trialToPaidConversion = (activeSubscriptionsCount + trialSubscriptionsCount) > 0
    ? (activeSubscriptionsCount / (activeSubscriptionsCount + trialSubscriptionsCount)) * 100
    : 0

  // 3. REVENUE METRICS
  const successPaymentsAgg = await prisma.platformPayment.aggregate({
    _sum: { convertedAmountInr: true },
    where: { status: "SUCCESS" }
  })
  const refundedPaymentsAgg = await prisma.platformPayment.aggregate({
    _sum: { convertedAmountInr: true },
    where: { status: "REFUNDED" }
  })

  const grossRevenue = successPaymentsAgg._sum.convertedAmountInr || 0
  const refunds = refundedPaymentsAgg._sum.convertedAmountInr || 0
  const netRevenue = grossRevenue - refunds
  const estimatedTaxes = grossRevenue * 0.18 // 18% GST estimate
  const gatewayFees = grossRevenue * 0.02 // 2% gateway transaction fee

  // 4. OPERATIONS METRICS
  const openTickets = await prisma.ticket.count({
    where: { status: { in: ["OPEN", "PENDING", "IN_PROGRESS"] } }
  })
  const highPriorityTickets = await prisma.ticket.count({
    where: {
      priority: { in: ["HIGH", "URGENT"] },
      status: { in: ["OPEN", "PENDING", "IN_PROGRESS"] }
    }
  })
  const failedPayments = await prisma.platformPayment.count({ where: { status: "FAILED" } })
  const failedWebhooks = await prisma.webhookLog.count({ where: { status: "FAILED" } })
  const failedEmails = await prisma.emailLog.count({ where: { status: "FAILED" } })
  const systemIncidents = await prisma.backgroundJobLog.count({ where: { status: "FAILED" } })

  // 5. RECENT ACTIVITY FEED (Audit Logs)
  const recentActivities = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8
  })

  // 6. TIME SERIES CHART AGGREGATIONS (7d, 30d, 90d, 12m)
  const payments = await prisma.platformPayment.findMany({
    where: { status: "SUCCESS" },
    select: { createdAt: true, convertedAmountInr: true }
  })
  const companies = await prisma.company.findMany({
    select: { createdAt: true }
  })

  const getChartData = (days: number, formatStr: string) => {
    const chartMap: Record<string, { revenue: number; signups: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const dateKey = format(subDays(new Date(), i), formatStr)
      chartMap[dateKey] = { revenue: 0, signups: 0 }
    }

    payments.forEach(p => {
      const key = format(p.createdAt, formatStr)
      if (chartMap[key]) {
        chartMap[key].revenue += p.convertedAmountInr
      }
    })

    companies.forEach(c => {
      const key = format(c.createdAt, formatStr)
      if (chartMap[key]) {
        chartMap[key].signups += 1
      }
    })

    return Object.entries(chartMap).map(([name, val]) => ({
      name,
      revenue: Math.round(val.revenue),
      signups: val.signups
    }))
  }

  const getMonthlyChartData = () => {
    const chartMap: Record<string, { revenue: number; signups: number }> = {}
    for (let i = 11; i >= 0; i--) {
      const date = subDays(new Date(), i * 30)
      const dateKey = format(date, "MMM yy")
      chartMap[dateKey] = { revenue: 0, signups: 0 }
    }

    payments.forEach(p => {
      const key = format(p.createdAt, "MMM yy")
      if (chartMap[key]) {
        chartMap[key].revenue += p.convertedAmountInr
      }
    })

    companies.forEach(c => {
      const key = format(c.createdAt, "MMM yy")
      if (chartMap[key]) {
        chartMap[key].signups += 1
      }
    })

    return Object.entries(chartMap).map(([name, val]) => ({
      name,
      revenue: Math.round(val.revenue),
      signups: val.signups
    }))
  }

  const data7d = getChartData(7, "EEE")
  const data30d = getChartData(30, "MMM dd")
  const data90d = getChartData(90, "MMM dd")
  const data12m = getMonthlyChartData()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Platform Health & Analytics</h1>
          <p className="text-xs text-zinc-500 mt-1">Real-time operations telemetry and financial performance metrics.</p>
        </div>
        <div className="text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          All Platform Integrations Operational
        </div>
      </div>

      {/* Grid of Metric Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Row 1: ARR */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Annual Run Rate</span>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">₹{arr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">ARR based on active subscriptions (MRR: ₹{mrr.toLocaleString("en-IN", { maximumFractionDigits: 0 })})</p>
          </div>
        </div>

        {/* Row 2: Gross Revenue */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gross Platform Revenue</span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">₹{grossRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">All successful payments (Net after refunds: ₹{netRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })})</p>
          </div>
        </div>

        {/* Row 3: Businesses */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Businesses</span>
            <Building2 size={16} className="text-purple-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{activeBusinesses} / {totalBusinesses}</h3>
            <p className="text-[10px] text-zinc-500 mt-1">+{newBusinesses30d} new businesses registered in the last 30 days</p>
          </div>
        </div>

        {/* Row 4: Subscriptions */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subscriptions</span>
            <CreditCard size={16} className="text-cyan-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{activeSubscriptionsCount} Active</h3>
            <p className="text-[10px] text-zinc-500 mt-1">{trialSubscriptionsCount} trial | Conversion rate: {trialToPaidConversion.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary operational telemetry metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <p className="text-xs text-zinc-500 font-medium">Taxes (18% Est.) / Gateway Fees (2% Est.)</p>
          <p className="text-lg font-bold mt-1">₹{estimatedTaxes.toLocaleString("en-IN", { maximumFractionDigits: 0 })} / ₹{gatewayFees.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <p className="text-xs text-zinc-500 font-medium">Monthly Churn Rate / Cancellations</p>
          <p className="text-lg font-bold mt-1 text-red-500">{churnRate.toFixed(2)}% ({cancelledSubscriptionsCount} total)</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <p className="text-xs text-zinc-500 font-medium">Total Platform Users / New Users</p>
          <p className="text-lg font-bold mt-1">{activeUsers} (+{newUsers30d} 30d)</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <p className="text-xs text-zinc-500 font-medium">Past-due Accounts / Suspended</p>
          <p className="text-lg font-bold mt-1 text-amber-600 dark:text-amber-400">{pastDueSubscriptionsCount} / {suspendedBusinesses}</p>
        </div>
      </div>

      {/* Recharts Graphical Dashboard */}
      <DashboardCharts 
        data7d={data7d}
        data30d={data30d}
        data90d={data90d}
        data12m={data12m}
      />

      {/* Row 3: Incidents & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Operational Incident Counters */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Operations & Failures</h3>
          
          <div className="space-y-3">
            <Link href="/app/admin/support" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <LifeBuoy size={16} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Open Tickets</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${openTickets > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-zinc-100 text-zinc-500"}`}>{openTickets} ({highPriorityTickets} priority)</span>
            </Link>

            <Link href="/app/admin/billing/payments" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Failed Payments</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${failedPayments > 0 ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-zinc-100 text-zinc-500"}`}>{failedPayments}</span>
            </Link>

            <Link href="/app/admin/system/webhooks" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Failed Webhook Deliveries</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${failedWebhooks > 0 ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-zinc-100 text-zinc-500"}`}>{failedWebhooks}</span>
            </Link>

            <Link href="/app/admin/system/emails" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Failed Transmissions</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${failedEmails > 0 ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-zinc-100 text-zinc-500"}`}>{failedEmails}</span>
            </Link>

            <Link href="/app/admin/system/jobs" className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Unresolved Job Incidents</span>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${systemIncidents > 0 ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-zinc-100 text-zinc-500"}`}>{systemIncidents}</span>
            </Link>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white">Recent Security & Audit Logs</h3>
            <Link href="/app/admin/audit" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              View all logs <ArrowUpRight size={14} />
            </Link>
          </div>
          
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900 max-h-[300px] overflow-y-auto">
            {recentActivities.map(log => (
              <div key={log.id} className="py-3 flex justify-between items-start text-xs">
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{log.action}</p>
                  <p className="text-zinc-500 mt-0.5">Admin: {log.adminId} {log.reason ? `| Reason: ${log.reason}` : ""}</p>
                </div>
                <span className="text-zinc-400 text-[10px] whitespace-nowrap">{format(log.createdAt, "MMM dd, HH:mm")}</span>
              </div>
            ))}

            {recentActivities.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-xs">No recent administrative events logged.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
