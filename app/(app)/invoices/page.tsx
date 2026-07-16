export const dynamic = 'force-dynamic'

import { getInvoices, deleteInvoice } from './actions'
import { getCompanySettings } from '../settings/actions'
import InvoiceListClient from './InvoiceListClient'

export const metadata = {
  title: 'Invoices - InvoiceFlowPro'
}

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  const settings = await getCompanySettings()

  return (
    <div className="h-full w-full bg-background flex flex-col p-4 md:p-8 overflow-hidden">
      <InvoiceListClient 
        initialInvoices={invoices} 
        settings={settings}
      />
    </div>
  )
}

