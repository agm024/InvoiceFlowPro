export const dynamic = 'force-dynamic'

import { getInvoices, deleteInvoice } from './actions'
import { getCompanySettings, getBanks } from '../settings/actions'
import InvoiceListClient from './InvoiceListClient'

export const metadata = {
  title: 'Invoices - InvoiceFlowPro'
}

export default async function InvoicesPage() {
  const allInvoices = await getInvoices()
  const invoices = allInvoices.filter(inv => inv.invoiceType !== 'QUOTATION')
  const { requireCompany } = await import('@/lib/auth-context')
  const prisma = (await import('@/utils/prisma')).default
  const { companyId } = await requireCompany()
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  let isLimitReached = false;
  if (company?.subscription?.plan?.invoiceLimits) {
    const currentCount = await prisma.invoice.count({ where: { companyId } })
    if (currentCount >= company.subscription.plan.invoiceLimits) {
      isLimitReached = true;
    }
  }

  const settings = await getCompanySettings()
  const banks = await getBanks()

  return (
    <div className="h-full w-full bg-background flex flex-col p-4 md:p-8 overflow-hidden">
      <InvoiceListClient 
        initialInvoices={invoices} 
        settings={settings}
        banks={banks}
      />
    </div>
  )
}

