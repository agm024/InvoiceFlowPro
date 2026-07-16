export const dynamic = 'force-dynamic'

import prisma from '@/utils/prisma'
import ExportClient from './ExportClient'

export default async function ExportPage() {
  const invoices = await prisma.invoice.findMany({
    where: { status: 'paid' },
    orderBy: { invoiceNumber: 'asc' },
    include: { client: true }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto w-full text-foreground">
      <h1 className="text-3xl font-bold tracking-tight mb-4">GST Offline Export</h1>
      <p className="text-zinc-500 mb-8">Generate a strictly formatted, multi-sheet Excel file (.xlsx) configured exactly for the GST Portal Offline Tool.</p>
      
      <ExportClient invoices={invoices} />

      <div className="bg-sidebar-bg border border-sidebar-border p-6 rounded-xl shadow-sm mt-8">
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-zinc-500">Sheet Breakdowns</h3>
        <ul className="space-y-4 text-sm text-zinc-400">
          <li><strong className="text-foreground">b2b</strong> - All invoices where the client has a registered GSTIN. Rate set to 18%.</li>
          <li><strong className="text-foreground">b2cs</strong> - Consolidated taxable totals for unregistered clients, grouped by Place of Supply (State Code-Name).</li>
          <li><strong className="text-foreground">exp</strong> - All international/export invoices configured as WOPAY (Without Payment of Tax) with 0% GST.</li>
          <li><strong className="text-foreground">cdnr</strong> - Scaffolded template for future Credit/Debit notes. Currently empty.</li>
        </ul>
      </div>
    </div>
  )
}
