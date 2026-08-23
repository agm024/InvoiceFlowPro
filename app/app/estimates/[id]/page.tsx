import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/utils/prisma'
import { format } from 'date-fns'
import ConvertToInvoiceButton from './ConvertToInvoiceButton'

export default async function EstimateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const estimate = await prisma.estimate.findUnique({
    where: { id },
    include: {
      client: true,
      items: {
        include: { product: true }
      }
    }
  })

  if (!estimate) notFound()

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/app/estimates" className="text-sm text-zinc-500 hover:text-foreground mb-2 inline-block">&larr; Back to Estimates</Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Estimate {estimate.estimateNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            estimate.status === 'invoiced' ? 'bg-green-100 text-green-700 border-green-200' :
            estimate.status === 'accepted' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700' :
            'bg-yellow-100 text-yellow-700 border-yellow-200'
          }`}>
            {estimate.status.toUpperCase()}
          </span>
          
          {estimate.status !== 'invoiced' && (
            <ConvertToInvoiceButton estimateId={estimate.id} />
          )}
        </div>
      </div>

      <div className="bg-sidebar-bg border border-sidebar-border rounded-xl p-8 shadow-sm">
        <div className="flex justify-between border-b border-sidebar-border pb-6 mb-6">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Estimate To:</p>
            <p className="font-semibold text-lg text-foreground">{estimate.client.name}</p>
            <p className="text-zinc-500 text-sm mt-1">{estimate.client.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 mb-1">Date:</p>
            <p className="font-medium text-foreground">{format(new Date(estimate.date), 'dd MMM yyyy')}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
        <table className="whitespace-nowrap w-full text-left text-sm mb-6">
          <thead className="text-zinc-500 border-b border-sidebar-border">
            <tr>
              <th className="pb-3 font-medium">Item</th>
              <th className="pb-3 font-medium text-right">Qty</th>
              <th className="pb-3 font-medium text-right">Rate</th>
              <th className="pb-3 font-medium text-right">Tax</th>
              <th className="pb-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sidebar-border">
            {estimate.items.map(item => (
              <tr key={item.id}>
                <td className="py-4">
                  <p className="font-medium text-foreground">{item.product.name}</p>
                  {item.product.description && <p className="text-xs text-zinc-500 mt-1">{item.product.description}</p>}
                </td>
                <td className="py-4 text-right text-zinc-600">{item.quantity}</td>
                <td className="py-4 text-right text-zinc-600">{estimate.currency} {item.price.toFixed(2)}</td>
                <td className="py-4 text-right text-zinc-600">{estimate.currency} {item.tax.toFixed(2)}</td>
                <td className="py-4 text-right font-medium text-foreground">
                  {estimate.currency} {((item.quantity * item.price) + item.tax).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div className="flex justify-end pt-6 border-t border-sidebar-border">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal:</span>
              <span className="font-medium">{estimate.currency} {estimate.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Tax:</span>
              <span className="font-medium">{estimate.currency} {estimate.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-sidebar-border pt-3">
              <span className="text-foreground">Total:</span>
              <span className="text-foreground">{estimate.currency} {estimate.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {estimate.notes && (
          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <p className="text-sm font-medium text-zinc-700 mb-2">Notes:</p>
            <p className="text-sm text-zinc-500 whitespace-pre-wrap">{estimate.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

