import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import DashboardCharts from './DashboardCharts'


export default async function AdminDashboardPage() {
  await requireSuperAdmin()

  const [
    totalCompanies,
    activeCompanies,
    totalUsers,
    invoicesAggregate,
    subscriptions,
    recentCompanies
  ] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
    prisma.invoice.aggregate({
      _count: { id: true },
      _sum: { total: true }
    }),
    prisma.subscription.findMany({
      where: { status: 'active' },
      include: { plan: true }
    }),
    prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        _count: {
          select: { users: true, invoices: true }
        }
      }
    })
  ])

  const invoices = await prisma.invoice.findMany({
    select: { total: true, exchangeRate: true, createdAt: true },
    where: { status: { not: 'draft' }, invoiceType: { not: 'QUOTATION' } }
  })
  
  const totalInvoiceVolume = invoices.length
  const totalInvoiceValue = invoices.reduce((sum, inv) => sum + (inv.total * (inv.exchangeRate || 1)), 0)

  const mrr = subscriptions.reduce((acc, sub) => {
    const price = sub.plan.price
    const monthlyValue = sub.plan.interval === 'year' ? price / 12 : price
    return acc + monthlyValue
  }, 0)

  // Formatting currency to INR
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  // Generate real historical data for the charts (last 6 months)
  const today = new Date()
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
    return {
      monthStr: d.toLocaleString('default', { month: 'short' }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
    }
  })

  // Signups data
  const allCompanies = await prisma.company.findMany({ select: { createdAt: true } })
  const signupsData = last6Months.map(m => {
    const count = allCompanies.filter(c => c.createdAt >= m.start && c.createdAt <= m.end).length
    return { name: m.monthStr, signups: count }
  })

  // Revenue data (mocked slightly based on MRR growth since we don't have historical subscription payments table yet, 
  // but let's base it on actual invoice volume over time to make it dynamic)
  const revenueData = last6Months.map(m => {
    const monthInvoices = invoices.filter(i => i.createdAt >= m.start && i.createdAt <= m.end)
    const rev = monthInvoices.reduce((sum, inv) => sum + (inv.total * (inv.exchangeRate || 1)), 0)
    // If SaaS revenue (subscriptions), we would query a payments table. 
    // Here we show platform gross volume, or we can just show MRR * (some factor).
    return { name: m.monthStr, revenue: rev }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-zinc-500 mt-2">Platform overview, revenue, and recent registrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Companies</p>
          <p className="text-3xl font-bold mt-2">{totalCompanies}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Active Companies</p>
          <p className="text-3xl font-bold mt-2">{activeCompanies}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Users</p>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Invoices (Vol / Val)</p>
          <p className="text-2xl font-bold mt-2 truncate" title={`${totalInvoiceVolume} / ${formatMoney(totalInvoiceValue)}`}>
            {totalInvoiceVolume} / {formatMoney(totalInvoiceValue)}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">MRR</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">{formatMoney(mrr)}</p>
        </div>
      </div>

      <DashboardCharts revenueData={revenueData} signupsData={signupsData} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Recent Company Registrations</h2>
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Company Name</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Users</th>
                <th className="px-6 py-4 font-medium">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentCompanies.map(company => (
                <tr key={company.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{company.name}</td>
                  <td className="px-6 py-4 text-zinc-500">{company.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{company._count.users}</td>
                  <td className="px-6 py-4 text-zinc-500">{company._count.invoices}</td>
                </tr>
              ))}
              {recentCompanies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No companies registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
