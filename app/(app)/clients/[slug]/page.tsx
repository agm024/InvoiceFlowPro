import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getStateNameByCode } from '@/utils/stateCodes'
import StatusBadge from '../../invoices/[id]/StatusBadge'
import DeleteProjectButton from '../../projects/DeleteProjectButton'

export default async function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const client = await prisma.client.findUnique({
    where: { slug },
    include: {
      invoices: {
        orderBy: { date: 'desc' },
        include: { milestone: true }
      }
    }
  })
  
  if (!client) notFound()

  const projects = await prisma.project.findMany({
    where: { clientId: client.id },
    include: {
      milestones: {
        include: { invoice: true },
        orderBy: { orderIndex: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const unlinkedInvoices = client.invoices
    .filter(inv => !inv.milestone && inv.status !== 'cancelled')
    .map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      total: inv.total,
      status: inv.status,
      date: inv.date
    }))

  // Calculate Money Got and Remaining in INR, factoring in partial payments
  const totalPaid = client.invoices.reduce((sum, inv) => {
    const paidAmount = inv.amountPaid > 0 ? inv.amountPaid : (inv.status === 'paid' ? inv.total : 0)
    return sum + (paidAmount * inv.exchangeRate)
  }, 0)
    
  const totalRemaining = client.invoices.reduce((sum, inv) => {
    if (inv.status === 'cancelled') return sum // skip cancelled
    const paidAmount = inv.amountPaid > 0 ? inv.amountPaid : (inv.status === 'paid' ? inv.total : 0)
    return sum + ((inv.total - paidAmount) * inv.exchangeRate)
  }, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/clients" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
            &larr; Back to Clients
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{client.name}</h1>
          <p className="text-zinc-500 mt-1">{client.email || 'No email'} • {client.phone || 'No phone'}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-6 py-4 rounded-xl text-right">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Money Received (INR)</p>
            <p className="text-2xl font-bold">₹{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-6 py-4 rounded-xl text-right">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1">Remaining (INR)</p>
            <p className="text-2xl font-bold">₹{totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-sidebar-bg border border-sidebar-border p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">GST Details</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-zinc-500 block">GSTIN</span> <span className="font-medium">{client.gstin || 'N/A'}</span></div>
            <div><span className="text-zinc-500 block">PAN No</span> <span className="font-medium">{client.panNo || 'N/A'}</span></div>
            <div><span className="text-zinc-500 block">Place of Supply</span> <span className="font-medium">{client.stateCode ? `${client.stateCode}-${client.stateName || getStateNameByCode(client.stateCode)}` : 'N/A'}</span></div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-sidebar-bg border border-sidebar-border p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">Address</h3>
          <p className="text-sm font-medium whitespace-pre-wrap">{client.address || 'No address provided.'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Chronological Project Roadmap</h2>
        <Link href="/projects/new" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">
          + New Project
        </Link>
      </div>

      <div className="space-y-8">
        {projects.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center text-zinc-500 shadow-sm">
            No active projects for this client. Create a project to build a milestone roadmap.
          </div>
        ) : (
          projects.map(project => {
            const billedSum = project.milestones.filter(m => m.status !== 'UNBILLED').reduce((sum, m) => sum + m.amount, 0)
            const progressPct = project.totalValue > 0 ? (billedSum / project.totalValue) * 100 : 0
            
            return (
              <div key={project.id} className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-sidebar-border bg-sidebar-bg/30">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
                      <p className="text-sm text-zinc-500">Total Ceiling: ₹ {project.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full">
                        {project.status}
                      </span>
                      <DeleteProjectButton projectId={project.id} projectName={project.name} />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-sidebar-border rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-zinc-500 mt-2">
                    <span>₹ {billedSum.toLocaleString()} Billed</span>
                    <span>₹ {(project.totalValue - billedSum).toLocaleString()} Unbilled Scope Equity</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-sidebar-border before:to-transparent">
                    
                    {project.milestones.map((milestone, idx) => {
                      const isUnbilled = milestone.status === 'UNBILLED'
                      const isPaid = milestone.status === 'PAID'
                      const isSent = milestone.status === 'SENT'

                      // Define dynamic styling based on milestone status
                      const dotColor = isPaid ? 'bg-emerald-500 border-emerald-500' : isSent ? 'bg-blue-500 border-blue-500' : 'bg-zinc-700 border-zinc-600'
                      const boxStyle = isUnbilled ? 'opacity-60 border-dashed border-zinc-600' : 'border-card-border shadow-sm'
                      const textColor = isUnbilled ? 'text-zinc-400' : 'text-foreground'
                      
                      return (
                        <div key={milestone.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-3 h-3 rounded-full border-2 ${dotColor} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}></div>
                          
                          <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)] bg-card-bg p-4 rounded-xl border ${boxStyle} transition-all`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className={`font-bold ${textColor}`}>Phase {idx + 1}: {milestone.name}</h4>
                              <div className="text-right ml-4">
                                <span className={`text-xs font-bold tabular-nums ${isUnbilled ? 'text-zinc-500' : 'text-foreground'}`}>
                                  ₹ {milestone.amount.toLocaleString()}
                                </span>
                                {milestone.percentage && (
                                  <span className="block text-[10px] text-zinc-500 mt-0.5">({milestone.percentage}%)</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                {isPaid && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                    PAID {milestone.invoice?.invoiceNumber && `- #${milestone.invoice.invoiceNumber}`}
                                  </span>
                                )}
                                {isSent && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                                    <span className="relative flex h-2 w-2 mr-1">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    SENT - Awaiting Payment
                                  </span>
                                )}
                                {isUnbilled && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-zinc-500 bg-sidebar-bg px-2 py-1 rounded">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    UNBILLED
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-2">
                                {isUnbilled && (
                                  <Link 
                                    href={`/invoices/new?milestoneId=${milestone.id}`} 
                                    className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm"
                                  >
                                    <span>🚀 Activate</span>
                                  </Link>
                                )}
                                {isSent && (
                                  <a 
                                    href={`https://wa.me/?text=Hi%2C%20the%20milestone%20invoice%20for%20%5B${encodeURIComponent(milestone.name)}%5D%20is%20ready%20for%20review.%20You%20can%20check%20the%20complete%20project%20ledger%20and%20download%20the%20details%20here%3A%20http%3A%2F%2Flocalhost%3A3000%2Fpay%2F${milestone.invoice?.invoiceNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border border-green-600/30 text-xs font-bold px-3 py-1.5 rounded transition-colors"
                                  >
                                    💬 Share Link
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
