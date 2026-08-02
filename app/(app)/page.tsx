export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import Link from 'next/link'
import { format, subDays, addDays, startOfMonth, subMonths, endOfMonth } from 'date-fns'
import { RevenueChart, TopCustomersChart } from '@/components/DashboardCharts'

export default async function DashboardPage() {
  const today = new Date()
  const currentMonthStart = startOfMonth(today)
  const previousMonthStart = startOfMonth(subMonths(today, 1))
  const previousMonthEnd = endOfMonth(subMonths(today, 1))

  // 1. WELCOME SECTION (Unpaid Invoices)
  const unpaidInvoices = await prisma.invoice.findMany({
    where: { 
      status: { in: ['draft', 'sent'] },
      invoiceType: { not: 'QUOTATION' }
    }
  })
  const unpaidCount = unpaidInvoices.length
  const unpaidValue = unpaidInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  // 2. RICH KPI CARDS (Revenue, Outstanding, etc.)
  const allInvoices = await prisma.invoice.findMany({ 
    where: { invoiceType: { not: 'QUOTATION' } },
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
    where: { date: { gte: currentMonthStart, lte: currentMonthEnd } }
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
  const allClients = await prisma.client.findMany({ include: { invoices: true } })
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
    <div className="p-8 max-w-7xl mx-auto w-full text-foreground space-y-8">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Good Morning 👋</h1>
          <p className="text-zinc-500">
            You have {unpaidCount} unpaid invoices worth <span className="font-semibold text-foreground">₹{unpaidValue.toLocaleString()}</span>.
          </p>
        </div>
        <Link href="/invoices/new" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-zinc-200 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors">
          + Create Invoice
        </Link>
      </div>
      
      {/* 2. Rich KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card-bg border border-card-border p-5 rounded-[12px] shadow-sm hover:shadow-md transition-all group">
          <p className="text-sm font-medium text-zinc-500 mb-3">Monthly Revenue</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">₹{revenueThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="flex items-center gap-2 mt-auto">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${revenueTrend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {revenueTrend >= 0 ? '↑' : '↓'} {Math.abs(revenueTrend).toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-500">vs last month</span>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border p-5 rounded-[12px] shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-zinc-500 mb-3">Outstanding Balance</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">₹{unpaidValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700">
              {unpaidCount} Invoices Pending
            </span>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border p-5 rounded-[12px] shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-zinc-500 mb-3">GST Collected (This Month)</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">₹{gstCollectedThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-xs text-zinc-500">From paid invoices</span>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border p-5 rounded-[12px] shadow-sm hover:shadow-md transition-all">
          <p className="text-sm font-medium text-zinc-500 mb-3">GST Paid / ITC (This Month)</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">₹{gstPaidThisMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-xs text-zinc-500">Eligible Input Tax Credit</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Widget */}
        <div className="bg-card-bg border border-card-border rounded-[12px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg flex justify-between items-center">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Revenue Over Time</h2>
          </div>
          <div className="p-5 flex-1">
            <RevenueChart data={revenueChartData} />
          </div>
        </div>

        {/* Top Clients Chart Widget */}
        <div className="bg-card-bg border border-card-border rounded-[12px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Top Clients (Revenue)</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            {topCustomersChartData.length > 0 ? (
              <TopCustomersChart data={topCustomersChartData} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500 py-10">
                <p className="text-sm">No revenue data for clients yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Clients Table Widget (Expanded to show Outstanding) */}
        <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-[12px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Client Financial Overview</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/50 dark:bg-sidebar-bg/50 text-zinc-500 text-xs">
                <tr>
                  <th className="px-5 py-3 font-medium">Client Name</th>
                  <th className="px-5 py-3 font-medium text-right">Paid Revenue</th>
                  <th className="px-5 py-3 font-medium text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-sidebar-border">
                {topClients.map(client => (
                  <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-sidebar-bg/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground">{client.name}</td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">₹{client.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="px-5 py-4 text-right font-medium text-amber-600 dark:text-amber-500">₹{client.outstanding.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Upcoming Payments */}
        <div className="bg-card-bg border border-card-border rounded-[12px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
            <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Upcoming Payments</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {upcomingPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full text-zinc-500">
                <span className="text-2xl mb-2">🎉</span>
                <p className="text-sm">No upcoming payments in the next 7 days.</p>
              </div>
            ) : (
              upcomingPayments.map(inv => (
                <div key={inv.id} className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-sidebar-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{inv.invoiceNumber}</p>
                    <p className="text-xs text-zinc-500">{inv.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-foreground">₹{(inv.total * inv.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-[10px] font-semibold text-red-500 mt-1">Due {format(inv.dueDate!, 'MMM d')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Timeline */}
      <div className="bg-card-bg border border-card-border rounded-[12px] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-card-border bg-zinc-50 dark:bg-sidebar-bg">
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            {timeline.map((event, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className={`w-5 h-5 rounded-full mt-0.5 border-2 border-white dark:border-zinc-950 shadow-sm flex-shrink-0 ${event.type === 'INVOICE' ? 'bg-zinc-100 dark:bg-zinc-8000' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{format(event.date, 'MMM d, yyyy • h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}
