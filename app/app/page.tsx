export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import Link from 'next/link'
import { format, subDays, addDays, startOfMonth, subMonths, endOfMonth } from 'date-fns'
import { RevenueChart, TopCustomersChart } from '@/components/DashboardCharts'
import { requireCompany } from '@/lib/auth-context'

export default async function DashboardPage() {
  const { companyId } = await requireCompany()
  const today = new Date()
  const currentMonthStart = startOfMonth(today)
  const previousMonthStart = startOfMonth(subMonths(today, 1))
  const previousMonthEnd = endOfMonth(subMonths(today, 1))

  const latestAnnouncement = await prisma.announcement.findFirst({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  // 1. WELCOME SECTION (Unpaid Invoices)
  const unpaidInvoices = await prisma.invoice.findMany({
    where: { 
      companyId,
      status: { in: ['draft', 'sent'] },
      invoiceType: { not: 'QUOTATION' }
    }
  })
  const unpaidCount = unpaidInvoices.length
  const unpaidValue = unpaidInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  // 2. RICH KPI CARDS (Revenue, Outstanding, etc.)
  const allInvoices = await prisma.invoice.findMany({ 
    where: { companyId, invoiceType: { not: 'QUOTATION' } },
    include: { client: true } 
  })
  const paidThisMonth = allInvoices.filter(i => i.status === 'paid' && i.date >= currentMonthStart)
  const paidLastMonth = allInvoices.filter(i => i.status === 'paid' && i.date >= previousMonthStart && i.date <= previousMonthEnd)
  
  const revenueThisMonth = paidThisMonth.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
  const revenueLastMonth = paidLastMonth.reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
  const revenueTrend = revenueLastMonth === 0 ? 100 : ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100

  // Fetch expenses for GST calculation
  const currentMonthEnd = endOfMonth(today)
  const expensesThisMonth = await prisma.expense.findMany({
    where: { companyId, date: { gte: currentMonthStart, lte: currentMonthEnd } }
  })
  
  const gstCollectedThisMonth = paidThisMonth.reduce((sum, i) => sum + (i.taxTotal * i.exchangeRate), 0)
  const gstPaidThisMonth = expensesThisMonth.reduce((sum, e) => sum + (e.itcEligible ? e.taxAmount : 0), 0)

  // 3. UPCOMING PAYMENTS WIDGET
  const sevenDaysFromNow = addDays(today, 7)
  const upcomingPayments = allInvoices
    .filter(i => i.status === 'sent' && i.dueDate && i.dueDate >= today && i.dueDate <= sevenDaysFromNow)
    .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))
    .slice(0, 5)

  // 4. TOP CLIENTS WIDGET
  const allClients = await prisma.client.findMany({ where: { companyId }, include: { invoices: true } })
  const topClients = allClients.map(client => {
    const revenue = client.invoices.filter(i => i.status === 'paid' && i.invoiceType !== 'QUOTATION').reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
    const outstanding = client.invoices.filter(i => i.status === 'sent' && i.invoiceType !== 'QUOTATION').reduce((sum, i) => sum + (i.total * i.exchangeRate), 0)
    return { ...client, revenue, outstanding }
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // 5. RECENT ACTIVITY TIMELINE
  const recentInvoices = allInvoices
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map(i => ({
      id: i.id,
      title: `Invoice ${i.invoiceNumber} ${i.status === 'paid' ? 'Paid' : i.status === 'sent' ? 'Sent' : 'Created'}`,
      date: i.createdAt,
      type: 'INVOICE'
    }))

  const recentClients = allClients
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3)
    .map(c => ({
      id: c.id,
      title: `Client Added: ${c.name}`,
      date: c.createdAt,
      type: 'CLIENT'
    }))

  const timeline = [...recentInvoices, ...recentClients]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)

  // 6. REVENUE CHART DATA (Last 6 Months)
  const revenueChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(today, 5 - i)
    const mStart = startOfMonth(d)
    const mEnd = endOfMonth(d)
    const paidInMonth = allInvoices.filter(inv => inv.status === 'paid' && inv.date >= mStart && inv.date <= mEnd)
    const revenue = paidInMonth.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
    return { name: format(d, 'MMM'), revenue }
  })
  
  // 7. TOP CUSTOMERS CHART DATA
  const topCustomersChartData = topClients.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    revenue: c.revenue
  }))

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full text-foreground space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good Morning 👋</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/expenses/new" className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
            Add Expense
          </Link>
          <Link href="/app/invoices/new" className="bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5">
            Create Invoice
          </Link>
        </div>
      </div>

      {latestAnnouncement && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center shrink-0 mt-1">
            <span className="text-indigo-600 dark:text-indigo-400 text-lg">📢</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-400">{latestAnnouncement.title}</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300/80 mt-1">
              {latestAnnouncement.content}
            </p>
          </div>
        </div>
      )}

      {/* 2. Needs Attention Banner (Only show if unpaid invoices exist) */}
      {unpaidCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center shrink-0">
              <span className="text-amber-600 dark:text-amber-500 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Action Needed: Outstanding Payments</h3>
              <p className="text-sm text-amber-700 dark:text-amber-500/80">
                You have {unpaidCount} invoice{unpaidCount > 1 ? 's' : ''} awaiting payment, totaling <span className="font-semibold">₹{unpaidValue.toLocaleString()}</span>.
              </p>
            </div>
          </div>
          <Link href="/app/invoices" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Outstanding
          </Link>
        </div>
      )}
      
      {/* 3. Core Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Outstanding */}
        <div className="glass p-5 rounded-2xl flex flex-col justify-between">
          <p className="text-sm font-medium text-zinc-500">Total Outstanding</p>
          <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4 text-foreground">₹{unpaidValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="mt-auto">
             <span className="text-xs font-semibold px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
               {unpaidCount} Pending
             </span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="glass p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p className="text-sm font-medium text-zinc-500">Revenue (This Month)</p>
          <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4 text-foreground text-emerald-600 dark:text-emerald-400">₹{revenueThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="flex items-center gap-2 mt-auto">
            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${revenueTrend >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
              {revenueTrend >= 0 ? '↑' : '↓'} {Math.abs(revenueTrend).toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-500">vs last month</span>
          </div>
        </div>

        {/* Metric 3: GST Collected */}
        <div className="glass p-5 rounded-2xl flex flex-col justify-between">
          <p className="text-sm font-medium text-zinc-500">GST Collected</p>
          <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4 text-foreground">₹{gstCollectedThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <p className="text-xs text-zinc-500 mt-auto">From paid invoices this month</p>
        </div>

        {/* Metric 4: ITC */}
        <div className="glass p-5 rounded-2xl flex flex-col justify-between">
          <p className="text-sm font-medium text-zinc-500">Input Tax Credit (ITC)</p>
          <h2 className="text-3xl font-bold tracking-tight mt-2 mb-4 text-foreground">₹{gstPaidThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <p className="text-xs text-zinc-500 mt-auto">From eligible expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-6">Revenue Over Time (6 Months)</h2>
          <div className="h-64">
            <RevenueChart data={revenueChartData} />
          </div>
        </div>

        {/* Upcoming Payments / Alerts */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-6">Upcoming Payments</h2>
          <div className="flex-1 flex flex-col gap-4">
            {upcomingPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500 bg-zinc-50/50 dark:bg-zinc-800/20 rounded-xl p-4">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">🎉</span>
                </div>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-1">No payments due in the next 7 days.</p>
              </div>
            ) : (
              upcomingPayments.map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                  <div>
                    <Link href={`/app/invoices/${inv.id}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors">{inv.invoiceNumber}</Link>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[150px]">{inv.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-foreground">₹{(inv.total * inv.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 mt-0.5">Due {format(inv.dueDate!, 'MMM d')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Top Clients (Revenue)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-sm">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Client Name</th>
                  <th className="px-6 py-4 font-medium text-right">Revenue</th>
                  <th className="px-6 py-4 font-medium text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {topClients.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No client data available yet.</td>
                  </tr>
                ) : (
                  topClients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">₹{client.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td className="px-6 py-4 text-right font-medium text-amber-600 dark:text-amber-500">₹{client.outstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-6">Recent Activity</h2>
          <div className="flex flex-col gap-5 relative pl-2">
            <div className="absolute left-[13px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            {timeline.length === 0 ? (
              <p className="text-zinc-500 text-sm pl-6">No recent activity.</p>
            ) : (
              timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10 group">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-white dark:ring-zinc-950 flex-shrink-0 transition-transform group-hover:scale-125 ${event.type === 'INVOICE' ? 'bg-primary' : 'bg-emerald-500'}`}></div>
                  <div className="flex-1 bg-white/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-colors">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      {format(event.date, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  )
}
