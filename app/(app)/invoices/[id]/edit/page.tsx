import { notFound } from 'next/navigation'
import Link from 'next/link'
import InvoiceForm from '../../new/InvoiceForm'
import prisma from '@/utils/prisma'
import { getClients } from '../../../clients/actions'
import { getProducts } from '../../../products/actions'
import { getBanks } from '../../../settings/actions'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { 
      items: {
        include: { product: true }
      } 
    }
  })
  
  if (!invoice) notFound()
  const clients = await getClients()
  const products = await getProducts()
  const banks = await getBanks()
  const companySettings = await prisma.companySettings.findFirst()

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-6">
        <Link href={`/invoices/${id}`} className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">← Back to Invoice</Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Invoice</h1>
      </div>
      <InvoiceForm 
        clients={clients} 
        products={products} 
        banks={banks}
        defaultInvoiceNumber={invoice.invoiceNumber}
        existingInvoice={invoice}
        companySettings={companySettings}
      />
    </div>
  )
}
