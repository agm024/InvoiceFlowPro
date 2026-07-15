import { notFound } from 'next/navigation'
import InvoiceForm from '../../new/InvoiceForm'
import prisma from '@/utils/prisma'
import { getClients } from '../../../clients/actions'
import { getProducts } from '../../../products/actions'
import { getBanks } from '../../../settings/actions'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true }
  })
  
  if (!invoice) notFound()
    
  const clients = await getClients()
  const products = await getProducts()
  const banks = await getBanks()

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Edit Invoice</h1>
      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-8">
        <InvoiceForm 
          clients={clients} 
          products={products} 
          banks={banks}
          defaultInvoiceNumber={invoice.invoiceNumber}
          existingInvoice={invoice}
        />
      </div>
    </div>
  )
}
