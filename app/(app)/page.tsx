import prisma from '@/utils/prisma'

export default async function DashboardPage() {
  const totalClients = await prisma.client.count()
  
  // Calculate today's revenue (paid invoices in INR equivalent)
  const paidInvoices = await prisma.invoice.findMany({
    where: { status: 'paid' }
  })
  const totalRevenueINR = paidInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  // Calculate pending payments (draft or sent invoices in INR equivalent)
  const pendingInvoices = await prisma.invoice.findMany({
    where: { status: { in: ['draft', 'sent'] } }
  })
  const pendingAmountINR = pendingInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  // Calculate foreign revenue breakdown
  const foreignPaid = paidInvoices.filter(inv => inv.currency !== 'INR')
  const foreignTotalINR = foreignPaid.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
  
  const foreignBreakdown = foreignPaid.reduce((acc, inv) => {
    if (!acc[inv.currency]) acc[inv.currency] = { foreignAmount: 0, inrAmount: 0 }
    acc[inv.currency].foreignAmount += inv.total
    acc[inv.currency].inrAmount += (inv.total * inv.exchangeRate)
    return acc
  }, {} as Record<string, { foreignAmount: number, inrAmount: number }>)

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">₹{totalRevenueINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Pending Payments</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">₹{pendingAmountINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">{pendingInvoices.length} inv</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Total Clients</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{totalClients}</h2>
          </div>
        </div>

        {/* Metric 4 (Foreign Revenue) */}
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group">
          <p className="text-sm font-medium text-zinc-500 mb-2">International (INR)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">₹{foreignTotalINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
          
          {/* Hover/Click Dropdown for Breakdown */}
          {foreignPaid.length > 0 && (
            <div className="mt-4 pt-4 border-t border-card-border text-sm">
              <details className="cursor-pointer group-details">
                <summary className="font-medium text-zinc-500 hover:text-foreground list-none flex justify-between items-center">
                  View Breakdown
                  <span className="text-xs">▼</span>
                </summary>
                <div className="mt-3 flex flex-col gap-2 pb-2">
                  {Object.entries(foreignBreakdown).map(([curr, amounts]) => (
                    <div key={curr} className="flex justify-between items-center text-xs">
                      <span className="font-medium bg-sidebar-bg px-2 py-1 rounded">{curr} {amounts.foreignAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-zinc-500">~ ₹{amounts.inrAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
