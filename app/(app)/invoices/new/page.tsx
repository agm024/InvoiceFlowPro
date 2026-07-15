import { getInvoiceFormData } from '../actions'
import InvoiceForm from './InvoiceForm'
import Link from 'next/link'

export default async function NewInvoicePage() {
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
        />
      </div>
    </div>
  )
}
