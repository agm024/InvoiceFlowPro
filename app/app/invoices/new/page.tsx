export const dynamic = 'force-dynamic'
import { getInvoiceFormData } from '../actions'
import InvoiceForm from './InvoiceForm'
import Link from 'next/link'

import prisma from '@/utils/prisma'
import { requireCompany } from '@/lib/auth-context'

export default async function NewInvoicePage({
  searchParams
}: {
  searchParams: Promise<{ milestoneId?: string }>
}) {
  const sp = await searchParams
  const milestoneId = sp.milestoneId

  let adHocMilestoneDetails = null;

  const { companyId } = await requireCompany()

  if (milestoneId) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    })
    
    if (milestone && milestone.project.companyId === companyId) {
      let hiddenProd = await prisma.product.findFirst({
        where: { name: milestone.name, isHidden: true, price: milestone.amount, companyId }
      })
      
      if (!hiddenProd) {
        hiddenProd = await prisma.product.create({
          data: {
            name: milestone.name,
            slug: `milestone-${milestone.id}-${Date.now()}`,
            price: milestone.amount,
            hsn: '998314',
            gstRate: 18,
            isHidden: true,
            companyId
          }
        })
      }
      
      adHocMilestoneDetails = {
        productId: hiddenProd.id,
        clientId: milestone.project.clientId,
        name: milestone.name,
        price: milestone.amount,
        hsn: hiddenProd.hsn,
        gstRate: hiddenProd.gstRate,
        currency: milestone.project.currency || 'INR'
      }
    }
  }

  const { clients, products, banks, exchangeRates, nextInvoiceNumber, companySettings, isLimitReached } = await getInvoiceFormData()

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-6">
        <Link href="/app/invoices" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Invoices
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Invoice</h1>
      </div>

      <InvoiceForm 
        clients={clients} 
        products={products} 
        banks={banks}
        exchangeRates={exchangeRates}
        defaultInvoiceNumber={nextInvoiceNumber} 
        milestoneId={milestoneId}
        adHocMilestoneDetails={adHocMilestoneDetails}
        companySettings={companySettings}
        isLimitReached={isLimitReached}
      />
    </div>
  )
}

