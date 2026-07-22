export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  // Top 4 Metrics Logic
  const totalClients = await prisma.client.count()
  
  const paidInvoices = await prisma.invoice.findMany({
    where: { status: 'paid', invoiceType: 'REGULAR' }
  })
  const totalRevenueINR = paidInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  const pendingInvoicesData = await prisma.invoice.findMany({
    where: { status: { in: ['draft', 'sent'] }, invoiceType: 'REGULAR' },
    include: { client: true },
    orderBy: { date: 'desc' }
  })
  
  // MILESTONE DATA FETCHING
  const allMilestones = await prisma.milestone.findMany()
  const paidMilestones = allMilestones.filter(m => m.status === 'PAID')
  const totalMilestoneCollections = paidMilestones.reduce((sum, m) => sum + m.amount, 0)
  
  const sentMilestones = allMilestones.filter(m => m.status === 'SENT')
  const activeOutstanding = sentMilestones.reduce((sum, m) => sum + m.amount, 0)

  const unbilledMilestones = allMilestones.filter(m => m.status === 'UNBILLED')
  const unbilledScopeEquity = unbilledMilestones.reduce((sum, m) => sum + m.amount, 0)

  const foreignPaid = paidInvoices.filter(inv => inv.currency !== 'INR')
  const foreignTotalINR = foreignPaid.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
  
  const foreignBreakdown = foreignPaid.reduce((acc, inv) => {
    if (!acc[inv.currency]) acc[inv.currency] = { foreignAmount: 0, inrAmount: 0 }
    acc[inv.currency].foreignAmount += inv.total
    acc[inv.currency].inrAmount += (inv.total * inv.exchangeRate)
    return acc
  }, {} as Record<string, { foreignAmount: number, inrAmount: number }>)

  // 3-Column Layout Logic
  const banks = await prisma.bank.findMany({
    include: {
      invoices: {
        where: { status: 'paid', invoiceType: 'REGULAR' }
      }
    }
  })
  
  const upiInvoices = paidInvoices.filter(inv => inv.paymentMethod === 'UPI')
  const upiTotal = upiInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

  const bankTotals = banks.map(bank => {
    let incoming = bank.invoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
    // Map UPI to HDFC if it's HDFC bank
    if (bank.bankName.toLowerCase().includes('hdfc')) {
      incoming += upiTotal
    }
    return {
      id: bank.id,
      name: bank.bankName,
      accountInfo: bank.accountNumber,
      incoming,
      outgoing: 0
    }
  })

  // If no HDFC bank exists, fallback UPI to the first bank
  if (!banks.some(b => b.bankName.toLowerCase().includes('hdfc')) && bankTotals.length > 0) {
    bankTotals[0].incoming += upiTotal
  }

  const totalIncoming = bankTotals.reduce((sum, b) => sum + b.incoming, 0)
  const totalOutgoing = 0

  const pendingInvoices = pendingInvoicesData.slice(0, 5)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentPaidInvoices = paidInvoices.filter(inv => inv.updatedAt >= sevenDaysAgo)
  const weeklyRevenueTotal = recentPaidInvoices.reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
  
  const todayStr = new Date().toLocaleDateString('en-GB')
  const weekAgoStr = sevenDaysAgo.toLocaleDateString('en-GB')

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Dashboard</h1>
      
      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Total Milestone Collections</p>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground tabular-nums">₹{totalMilestoneCollections.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h2>
            <p className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 inline-block px-2 py-0.5 rounded-sm w-fit mt-1">Based on {paidMilestones.length} completed project phases</p>
          </div>
        </div>
        
        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Locked & Awaiting Sign-offs</p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-medium">Active Outstanding (Sent)</span>
              <span className="text-sm font-bold text-foreground tabular-nums">₹{activeOutstanding.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-medium">Unbilled Scope Equity</span>
              <span className="text-sm font-bold text-foreground tabular-nums">₹{unbilledScopeEquity.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-2">Total Clients</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground tabular-nums">{totalClients}</h2>
          </div>
        </div>

        <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group">
          <p className="text-sm font-medium text-zinc-500 mb-2">International (INR)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">₹{foreignTotalINR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
          
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Payments Column */}
        <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="font-semibold text-foreground text-lg">Payments</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="bg-sidebar-bg/50 rounded-lg p-3 grid grid-cols-3 text-xs font-semibold text-zinc-500 mb-4">
              <div>Bank</div>
              <div className="text-right">Incoming</div>
              <div className="text-right">Outgoing</div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              {bankTotals.map(bank => (
                <div key={bank.id} className="grid grid-cols-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{bank.name}</p>
                    <p className="text-xs text-zinc-500">{bank.accountInfo}</p>
                  </div>
                  <div className="text-right font-semibold text-emerald-600">
                    ₹ {bank.incoming.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-right font-semibold text-red-500">
                    ₹ {bank.outgoing}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 text-sm font-bold pt-6 mt-6 border-t border-sidebar-border">
              <div className="text-zinc-600">TOTAL</div>
              <div className="text-right text-emerald-600">₹ {totalIncoming.toLocaleString(undefined, { minimumFractionDigits: 0 })}</div>
              <div className="text-right text-red-500">₹ {totalOutgoing}</div>
            </div>
          </div>
        </div>

        {/* Pending Invoices Column */}
        <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="font-semibold text-foreground text-lg">Pending Invoices</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {pendingInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-zinc-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/><path d="M12 15h.01"/><path d="M16 15h.01"/><path d="M8 15h.01"/></svg>
                <p className="font-medium text-zinc-500">No Pending Invoices</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {pendingInvoices.map(inv => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="flex justify-between border-b border-sidebar-border pb-4 last:border-0 hover:bg-sidebar-bg/30 p-2 rounded transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{inv.invoiceNumber}</p>
                      <p className="text-xs text-zinc-500">{inv.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{(inv.total * inv.exchangeRate).toLocaleString()}</p>
                      <p className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded mt-1 inline-block">{inv.status}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Phase Milestone Runway */}
        <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="font-semibold text-foreground text-lg">Phase Milestone Runway</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 tabular-nums">
              ₹ {allMilestones.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
            </h2>
            <p className="text-xs text-zinc-500 font-medium mb-12">Total Pipeline Value</p>

            <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-auto min-h-[150px]">
              {[...Array(6)].map((_, i) => {
                const d = new Date()
                d.setMonth(d.getMonth() - (5 - i))
                const monthStr = d.toLocaleString('en-US', { month: 'short' })
                
                // Aggregate milestones for this month
                const mTotal = allMilestones
                  .filter(m => new Date(m.createdAt).getMonth() === d.getMonth())
                  .reduce((sum, m) => sum + m.amount, 0)
                
                const height = mTotal > 0 ? Math.max(10, (mTotal / 500000) * 120) : 4 // fake scale

                return (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${mTotal > 0 ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-sidebar-border'}`} 
                      style={{ height: `${height}px` }}
                    ></div>
                    <span className="text-[10px] text-zinc-400 font-medium">{monthStr}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      ₹ {mTotal.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
