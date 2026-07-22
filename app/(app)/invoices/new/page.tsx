export const dynamic = 'force-dynamic'
import { getInvoiceFormData } from '../actions'
import InvoiceForm from './InvoiceForm'
import Link from 'next/link'

import prisma from '@/utils/prisma'

export default async function NewInvoicePage({
  searchParams
}: {
  searchParams: Promise<{ milestoneId?: string }>
}) {
  const sp = await searchParams
  const milestoneId = sp.milestoneId

  let adHocMilestoneDetails = null;

  if (milestoneId) {
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    })
    
    if (milestone) {
      let hiddenProd = await prisma.product.findFirst({
        where: { name: milestone.name, isHidden: true, price: milestone.amount }
      })
      
      if (!hiddenProd) {
        hiddenProd = await prisma.product.create({
          data: {
            name: milestone.name,
            slug: `milestone-${milestone.id}-${Date.now()}`,
            price: milestone.amount,
            hsn: '998314',
            gstRate: 18,
            isHidden: true
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

  const { clients, products, banks, exchangeRates, nextInvoiceNumber } = await getInvoiceFormData()

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/invoices" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Invoices
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Invoice</h1>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-8">
        <InvoiceForm 
          clients={clients} 
          products={products} 
          banks={banks}
          exchangeRates={exchangeRates}
          defaultInvoiceNumber={nextInvoiceNumber} 
          milestoneId={milestoneId}
          adHocMilestoneDetails={adHocMilestoneDetails}
        />
      </div>
    </div>
  )
}

