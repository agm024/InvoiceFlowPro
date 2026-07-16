import { getInvoiceDetails } from './actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import InvoiceActionsDropdown from './InvoiceActionsDropdown'
import StatusBadge from './StatusBadge'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (id === 'new') {
    // Sometimes Next.js dev server routes /new here incorrectly. 
    // This forces a redirect to the correct static route to break the cache.
    const { redirect } = await import('next/navigation')
    redirect('/invoices/new')
  }

  const invoice = await getInvoiceDetails(id)
  
  if (!invoice) {
    notFound()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/invoices" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
            &larr; Back to Invoices
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} invoiceId={invoice.id} />
          </div>
        </div>
        
        {/* Actions Component */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link href={`/invoices/${invoice.id}/edit`} className="text-sm bg-sidebar-bg border border-sidebar-border px-4 py-2 rounded-md font-medium text-foreground hover:bg-sidebar-border transition-colors">
            Edit Invoice
          </Link>
          <InvoiceActionsDropdown 
            invoiceId={invoice.id} 
            invoiceNumber={invoice.invoiceNumber}
            invoiceType={invoice.invoiceType} 
            total={invoice.total}
            amountPaid={invoice.amountPaid}
            status={invoice.status}
          />
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        {/* Invoice Header */}
        <div className="p-8 border-b border-card-border flex justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Billed To</h3>
            <p className="text-lg font-medium text-foreground">{invoice.client.name}</p>
            {invoice.client.address && <p className="text-sm text-zinc-500 whitespace-pre-wrap">{invoice.client.address}</p>}
            {invoice.client.gstin && <p className="text-sm text-zinc-500 mt-1">GSTIN: <span className="font-medium text-foreground uppercase">{invoice.client.gstin}</span></p>}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Invoice Details</h3>
            <p className="text-sm text-foreground">Date: {format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
            {invoice.dueDate && <p className="text-sm text-foreground">Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>}
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-sm text-left">
          <thead className="bg-sidebar-bg text-zinc-500 border-b border-sidebar-border uppercase text-xs">
            <tr>
              <th className="px-8 py-4 font-medium">Item Description</th>
              <th className="px-8 py-4 font-medium text-right">Qty</th>
              <th className="px-8 py-4 font-medium text-right">Price</th>
              <th className="px-8 py-4 font-medium text-right">Tax</th>
              <th className="px-8 py-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sidebar-border">
            {invoice.items.map((item) => (
              <tr key={item.id} className="text-foreground">
                <td className="px-8 py-4">
                  <p className="font-medium">{item.product.name}</p>
                  {item.product.hsn && <p className="text-xs text-zinc-500 mt-1">HSN: {item.product.hsn}</p>}
                </td>
                <td className="px-8 py-4 text-right">{item.quantity}</td>
                <td className="px-8 py-4 text-right">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{item.price.toFixed(2)}</td>
                <td className="px-8 py-4 text-right">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{item.tax.toFixed(2)}</td>
                <td className="px-8 py-4 text-right font-medium">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{((item.price * item.quantity) + item.tax).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="p-8 bg-sidebar-bg/30 flex justify-end">
          <div className="w-full md:w-72">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium text-foreground">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-zinc-500">Total Tax (GST)</span>
              <span className="font-medium text-foreground">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-card-border text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="p-8 border-t border-card-border bg-sidebar-bg/10">
            <h3 className="text-sm font-semibold text-zinc-500 mb-2">Notes</h3>
            <p className="text-sm text-foreground whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
