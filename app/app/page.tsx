export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import Link from 'next/link'
import { format, subDays, addDays, startOfMonth, subMonths, endOfMonth, startOfYear } from 'date-fns'
import { RevenueChart } from '@/components/DashboardCharts'
import { requireCompany } from '@/lib/auth-context'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ timeframe?: string }>
}) {
  const { companyId } = await requireCompany()
  const resolvedParams = await searchParams
  const timeframe = resolvedParams.timeframe || '30d'

  const today = new Date()
  let dateLimit = subDays(today, 30)
  let prevDateLimitStart = subDays(today, 60)
  let prevDateLimitEnd = subDays(today, 30)

  if (timeframe === '7d') {
    dateLimit = subDays(today, 7)
    prevDateLimitStart = subDays(today, 14)
    prevDateLimitEnd = subDays(today, 7)
  } else if (timeframe === '90d') {
    dateLimit = subDays(today, 90)
    prevDateLimitStart = subDays(today, 180)
    prevDateLimitEnd = subDays(today, 90)
  } else if (timeframe === '6m') {
    dateLimit = subMonths(today, 6)
    prevDateLimitStart = subMonths(today, 12)
    prevDateLimitEnd = subMonths(today, 6)
  } else if (timeframe === '12m') {
    dateLimit = subMonths(today, 12)
    prevDateLimitStart = subMonths(today, 24)
    prevDateLimitEnd = subMonths(today, 12)
  } else if (timeframe === 'ytd') {
    dateLimit = startOfYear(today)
    prevDateLimitStart = startOfYear(subMonths(today, 12))
    prevDateLimitEnd = endOfMonth(subMonths(today, 12))
  }

  // 1. ANNOUNCEMENTS
  const latestAnnouncement = await prisma.announcement.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  // 2. DB QUERIES
  const allInvoices = await prisma.invoice.findMany({
    where: { companyId, invoiceType: { not: 'QUOTATION' } },
    include: { client: true }
  })

  const allExpenses = await prisma.expense.findMany({
    where: { companyId }
  })

  const allProjects = await prisma.project.findMany({
    where: { companyId, status: 'ACTIVE' },
    include: { milestones: true, client: true }
  })

  // 3. STATS IN CURRENT TIMEFRAME
  const paidInvoices = allInvoices.filter(i => i.status === 'paid' && i.date >= dateLimit)
  const expensesInTimeframe = allExpenses.filter(e => e.date >= dateLimit)

  const revenueTimeframe = paidInvoices.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
  const expensesTimeframe = expensesInTimeframe.filter(e => e.category !== 'TAX_PAYMENT').reduce((sum, e) => sum + e.totalAmount, 0)
  const profitTimeframe = revenueTimeframe - expensesTimeframe

  // GST Calculations
  const gstCollected = paidInvoices.reduce((sum, i) => sum + (i.taxTotal * i.exchangeRate), 0)
  const itcAmount = expensesInTimeframe.filter(e => e.itcEligible).reduce((sum, e) => sum + e.taxAmount, 0)
  const gstLiability = Math.max(0, gstCollected - itcAmount)
  const gstPaid = allExpenses.filter(e => e.category === 'TAX_PAYMENT' && e.date >= dateLimit).reduce((sum, e) => sum + e.totalAmount, 0)
  const gstBalance = gstLiability - gstPaid

  // Historical calculations (for trend percentages)
  const prevPaidInvoices = allInvoices.filter(i => i.status === 'paid' && i.date >= prevDateLimitStart && i.date <= prevDateLimitEnd)
  const prevExpenses = allExpenses.filter(e => e.date >= prevDateLimitStart && e.date <= prevDateLimitEnd && e.category !== 'TAX_PAYMENT')
  
  const prevRevenue = prevPaidInvoices.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
  const prevExpensesSum = prevExpenses.reduce((sum, e) => sum + e.totalAmount, 0)
  
  const revenueTrend = prevRevenue === 0 ? 100 : ((revenueTimeframe - prevRevenue) / prevRevenue) * 100
  const expenseTrend = prevExpensesSum === 0 ? 100 : ((expensesTimeframe - prevExpensesSum) / prevExpensesSum) * 100

  // Balance Sheet Metrics (Current totals regardless of timeframe)
  const outstandingInvoices = allInvoices.filter(i => ['draft', 'sent'].includes(i.status))
  const totalOutstanding = outstandingInvoices.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
  
  const overdueInvoices = allInvoices.filter(i => i.status === 'sent' && i.dueDate && i.dueDate < today)
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)

  // 4. CHART DATA GENERATION
  let revenueChartData: Array<{ name: string, revenue: number, expenses: number }> = []
  if (timeframe === '7d') {
    revenueChartData = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(today, 6 - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      return {
        name: format(d, 'EEE'),
        revenue: allInvoices.filter(inv => inv.status === 'paid' && inv.date >= dayStart && inv.date <= dayEnd).reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0),
        expenses: allExpenses.filter(e => e.date >= dayStart && e.date <= dayEnd && e.category !== 'TAX_PAYMENT').reduce((sum, e) => sum + e.totalAmount, 0)
      }
    })
  } else if (timeframe === '30d') {
    revenueChartData = Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(today, 29 - i)
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
      return {
        name: format(d, 'dd MMM'),
        revenue: allInvoices.filter(inv => inv.status === 'paid' && inv.date >= dayStart && inv.date <= dayEnd).reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0),
        expenses: allExpenses.filter(e => e.date >= dayStart && e.date <= dayEnd && e.category !== 'TAX_PAYMENT').reduce((sum, e) => sum + e.totalAmount, 0)
      }
    })
  } else if (timeframe === '90d') {
    revenueChartData = Array.from({ length: 12 }).map((_, i) => {
      const startW = subDays(today, (12 - i) * 7)
      const endW = subDays(today, (11 - i) * 7)
      return {
        name: `Wk ${i + 1}`,
        revenue: allInvoices.filter(inv => inv.status === 'paid' && inv.date >= startW && inv.date <= endW).reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0),
        expenses: allExpenses.filter(e => e.date >= startW && e.date <= endW && e.category !== 'TAX_PAYMENT').reduce((sum, e) => sum + e.totalAmount, 0)
      }
    })
  } else {
    const monthsCount = timeframe === '6m' ? 6 : timeframe === '12m' ? 12 : (today.getMonth() + 1)
    revenueChartData = Array.from({ length: monthsCount }).map((_, i) => {
      const d = subMonths(today, (monthsCount - 1) - i)
      const mStart = startOfMonth(d)
      const mEnd = endOfMonth(d)
      return {
        name: format(d, 'MMM yy'),
        revenue: allInvoices.filter(inv => inv.status === 'paid' && inv.date >= mStart && inv.date <= mEnd).reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0),
        expenses: allExpenses.filter(e => e.date >= mStart && e.date <= mEnd && e.category !== 'TAX_PAYMENT').reduce((sum, e) => sum + e.totalAmount, 0)
      }
    })
  }

  // 5. OTHER SECTIONS DATA
  const sevenDaysFromNow = addDays(today, 7)
  const upcomingPayments = allInvoices
    .filter(i => i.status === 'sent' && i.dueDate && i.dueDate >= today && i.dueDate <= sevenDaysFromNow)
    .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
    .slice(0, 5)

  const topClients = (await prisma.client.findMany({ where: { companyId }, include: { invoices: true } }))
    .map(client => {
      const revenue = client.invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
      const outstanding = client.invoices.filter(i => ['draft', 'sent'].includes(i.status)).reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
      return { ...client, revenue, outstanding }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const recentExpenses = allExpenses
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const projectPerformance = allProjects
    .map(proj => {
      const totalBilled = proj.milestones.filter(m => m.status === 'PAID').reduce((sum, m) => sum + m.amount, 0)
      return {
        id: proj.id,
        name: proj.name,
        clientName: proj.client.name,
        totalValue: proj.totalValue,
        billed: totalBilled,
        progress: proj.totalValue > 0 ? (totalBilled / proj.totalValue) * 100 : 0
      }
    })
    .slice(0, 5)

  // Timeline feed
  const timeline = [
    ...allInvoices.slice(0, 5).map(i => ({
      id: i.id,
      title: `Invoice ${i.invoiceNumber} updated to ${i.status.toUpperCase()}`,
      date: i.updatedAt,
      type: 'INVOICE'
    })),
    ...allExpenses.slice(0, 5).map(e => ({
      id: e.id,
      title: `Expense logged for ${e.vendorName} (${e.category})`,
      date: e.createdAt,
      type: 'EXPENSE'
    }))
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)

  const timeframeLabels: Record<string, string> = {
    '7d': '7 Days',
    '30d': '30 Days',
    '90d': '90 Days',
    '6m': '6 Months',
    '12m': '12 Months',
    'ytd': 'Year To Date'
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full text-zinc-950 dark:text-zinc-50 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Tenant Dashboard monitoring real-time transactions.</p>
        </div>
        
        {/* Timeframe Controls */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {Object.entries(timeframeLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/app?timeframe=${key}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === key 
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {latestAnnouncement && (
        <div className="bg-indigo-50 dark:bg-indigo-955/20 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-4">
          <span className="text-indigo-600 dark:text-indigo-400 text-lg">📢</span>
          <div>
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-300">{latestAnnouncement.title}</h3>
            <p className="text-xs text-indigo-800 dark:text-indigo-400 mt-0.5">{latestAnnouncement.content}</p>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* KPI: Collected */}
        <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Collected Revenue</span>
          <h2 className="text-3xl font-black mt-2 text-emerald-600 dark:text-emerald-400">₹{revenueTimeframe.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold">
            <span className={`px-2 py-0.5 rounded ${revenueTrend >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-955/20'}`}>
              {revenueTrend >= 0 ? '↑' : '↓'} {Math.abs(revenueTrend).toFixed(1)}%
            </span>
            <span className="text-zinc-400">vs prev period</span>
          </div>
        </div>

        {/* KPI: Outstanding */}
        <div className="bg-white dark:bg-zinc-955 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Outstanding</span>
          <h2 className="text-3xl font-black mt-2 text-zinc-900 dark:text-white">₹{totalOutstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
              {outstandingInvoices.length} Invoices Pending
            </span>
          </div>
        </div>

        {/* KPI: Overdue */}
        <div className="bg-white dark:bg-zinc-955 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Overdue</span>
          <h2 className="text-3xl font-black mt-2 text-red-500">₹{totalOverdue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-955/20">
              {overdueInvoices.length} Overdue
            </span>
          </div>
        </div>

        {/* KPI: Expenses */}
        <div className="bg-white dark:bg-zinc-955 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Expenses</span>
          <h2 className="text-3xl font-black mt-2 text-zinc-900 dark:text-white">₹{expensesTimeframe.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold">
            <span className={`px-2 py-0.5 rounded ${expenseTrend <= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-955/20'}`}>
              {expenseTrend <= 0 ? '↓' : '↑'} {Math.abs(expenseTrend).toFixed(1)}%
            </span>
            <span className="text-zinc-400">vs prev period</span>
          </div>
        </div>
      </div>

      {/* Tax & GST KPI Subsection */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">GST & ITC Reconciliation</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase line-clamp-1">GST Collected</span>
            <p className="text-lg md:text-xl font-bold mt-1">₹{gstCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase line-clamp-1">ITC Claimed</span>
            <p className="text-lg md:text-xl font-bold mt-1 text-emerald-600">₹{itcAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase line-clamp-1">GST Paid</span>
            <p className="text-lg md:text-xl font-bold mt-1">₹{gstPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase line-clamp-1">Payable</span>
            <p className="text-lg md:text-xl font-black mt-1 text-zinc-950 dark:text-white">
              ₹{gstBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-6">Financial Cash Flow trend ({timeframeLabels[timeframe]})</h2>
          <div className="h-72">
            <RevenueChart data={revenueChartData} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-6">Upcoming Payments (7d)</h2>
            <div className="space-y-4">
              {upcomingPayments.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <p className="text-sm font-semibold">All caught up!</p>
                  <p className="text-xs mt-1">No invoices are due this week.</p>
                </div>
              ) : (
                upcomingPayments.map(inv => (
                  <div key={inv.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                    <div>
                      <Link href={`/app/invoices/${inv.id}`} className="font-bold text-sm hover:underline">{inv.invoiceNumber}</Link>
                      <p className="text-xs text-zinc-500 truncate max-w-[120px]">{inv.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{(inv.total * inv.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold mt-0.5">Due {format(new Date(inv.dueDate!), 'MMM dd')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Client Revenue & Project Margins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients Table */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Top Clients (Revenue Generated)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4 text-right">Revenue Paid</th>
                  <th className="px-6 py-4 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {topClients.map(client => (
                  <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-bold">{client.name}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-bold">₹{client.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-red-500 font-bold">₹{client.outstanding.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project performance */}
        <div className="bg-white dark:bg-zinc-955 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Active Project Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
                {projectPerformance.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4 text-zinc-500">{p.clientName}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-950 dark:bg-white" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <span className="font-bold">{p.progress.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {projectPerformance.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No active projects.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-6">Recent Activity Timeline</h2>
        <div className="space-y-4">
          {timeline.map((event, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{event.title}</span>
              <span className="text-zinc-400">{format(new Date(event.date), 'MMM dd, hh:mm a')}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
