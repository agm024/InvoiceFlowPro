export const dynamic = 'force-dynamic'

import { getInvoices } from '../invoices/actions'
import { getCompanySettings } from '../settings/actions'
import InvoiceListClient from '../invoices/InvoiceListClient'

export const metadata = {
  title: 'Quotations - InvoiceFlowPro'
}

export default async function QuotationsPage() {
  const allInvoices = await getInvoices()
  // Filter for quotations only
  const quotations = allInvoices.filter(inv => inv.invoiceType === 'QUOTATION')
  const settings = await getCompanySettings()

  return (
    <div className="h-full w-full bg-background flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quotations</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your estimates and quotes</p>
      </div>
      <InvoiceListClient 
        initialInvoices={quotations} 
        settings={settings}
        type="quotation"
      />
    </div>
  )
}
