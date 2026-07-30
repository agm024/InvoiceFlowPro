import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import PrintButton from '../PrintButton'
import { ArrowLeft } from 'lucide-react'

export default async function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const invoice = await prisma.invoice.findUnique({
    where: { id: resolvedParams.id },
    include: {
      client: true,
      items: {
        include: { product: true }
      }
    }
  })
  
  if (!invoice) notFound()

  return (
    <div className="p-8 max-w-5xl mx-auto w-full min-h-screen bg-white text-zinc-900">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <Link href={`/pay/${invoice.id}`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-4">
            <ArrowLeft size={16} /> Back to Payment
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <PrintButton />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="p-8 border-b border-zinc-200 flex justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Billed To</h3>
            <p className="text-lg font-medium">{invoice.client.name}</p>
            {invoice.client.address && <p className="text-sm text-zinc-500 whitespace-pre-wrap">{invoice.client.address}</p>}
            {invoice.client.gstin && <p className="text-sm text-zinc-500 mt-1">GSTIN: <span className="font-medium uppercase">{invoice.client.gstin}</span></p>}
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Invoice Details</h3>
            <p className="text-sm">Date: {format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
            {invoice.dueDate && <p className="text-sm">Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>}
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200 uppercase text-xs">
            <tr>
              <th className="px-8 py-4 font-medium">Item Description</th>
              <th className="px-8 py-4 font-medium text-right">Qty</th>
              <th className="px-8 py-4 font-medium text-right">Price</th>
              <th className="px-8 py-4 font-medium text-right">Tax</th>
              <th className="px-8 py-4 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {invoice.items.map((item) => (
              <tr key={item.id}>
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
        <div className="p-8 bg-zinc-50 flex justify-end">
          <div className="w-full md:w-72">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-zinc-500">Total Tax (GST)</span>
              <span className="font-medium">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-zinc-200 text-lg font-bold">
              <span>Total</span>
              <span>{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="p-8 border-t border-zinc-200 bg-white">
            <h3 className="text-sm font-semibold text-zinc-500 mb-2">Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
