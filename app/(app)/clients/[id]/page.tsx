import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import StatusBadge from '../../invoices/[id]/StatusBadge'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      invoices: {
        orderBy: { date: 'desc' }
      }
    }
  })
  
  if (!client) notFound()

  // Calculate Money Got (Paid invoices) and Remaining (Draft/Sent invoices) in INR
  const totalPaid = client.invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)
    
  const totalRemaining = client.invoices
    .filter(inv => ['draft', 'sent', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.total * inv.exchangeRate), 0)

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
            <div><span className="text-zinc-500 block">Place of Supply</span> <span className="font-medium">{client.stateCode ? `${client.stateCode}-${client.stateName}` : 'N/A'}</span></div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-sidebar-bg border border-sidebar-border p-6 rounded-xl">
          <h3 className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">Address</h3>
          <p className="text-sm font-medium whitespace-pre-wrap">{client.address || 'No address provided.'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Transaction History</h2>
      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice No</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sidebar-border">
            {client.invoices.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No invoices found for this client.</td>
              </tr>
            ) : (
              client.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-sidebar-bg/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <Link href={`/invoices/${inv.id}`} className="hover:underline">{inv.invoiceNumber}</Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {format(new Date(inv.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} invoiceId={inv.id} />
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    {inv.currency} {inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
