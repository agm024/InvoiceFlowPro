import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import CheckoutButton from './CheckoutButton'
import { Building2, FileText, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export const metadata = {
  title: 'Secure Payment',
}

export default async function PayInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  let invoice = await prisma.invoice.findUnique({
    where: { id: resolvedParams.id },
    include: { client: true, items: { include: { product: true } } }
  })

  if (!invoice) {
    invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: resolvedParams.id },
      include: { client: true, items: { include: { product: true } } }
    })
  }

  if (!invoice) notFound()

  let companySettings = await prisma.companySettings.findUnique({
    where: { companyId: invoice.companyId }
  })
  if (!companySettings) {
    companySettings = await prisma.companySettings.findFirst()
  }
  const amountDue = invoice.total - (invoice.amountPaid || 0)
  const isPaid = invoice.status === 'paid' || amountDue <= 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Action (Checkout / QR Code) */}
        <div className="p-8 flex flex-col gap-8">
          {isPaid ? (
            <div className="bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/30 p-4 rounded-xl text-center text-green-700 dark:text-green-400">
              <CheckCircle size={32} className="mx-auto mb-2" />
              <p className="font-semibold text-lg">Invoice Paid</p>
              <p className="text-sm mt-1 opacity-80">Thank you for your business!</p>
            </div>
          ) : (
            <div>
              <CheckoutButton 
                invoiceId={invoice.id} 
                amount={amountDue} 
                currency={invoice.currency} 
                companyName={companySettings?.companyName || 'Company'}
                upiId={companySettings?.upiId || ''}
                invoiceNumber={invoice.invoiceNumber}
                clientName={invoice.client.name}
              />
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Date Issued</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{format(new Date(invoice.date), 'MMMM dd, yyyy')}</span>
            </div>
            {invoice.dueDate && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Due Date</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500">Amount Paid</span>
              <span className="font-medium text-green-600">{invoice.currency} {(invoice.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-zinc-900 dark:text-zinc-100">Amount Due</span>
              <span className="text-zinc-900 dark:text-zinc-100">{invoice.currency} {amountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="text-center print:hidden">
            <Link href={`/pay/${invoice.id}/invoice`} className="text-sm font-medium text-zinc-900 dark:text-white hover:opacity-70 transition-opacity inline-flex items-center gap-1">
              <FileText size={16} /> View Original Invoice PDF
            </Link>
          </div>
          
        </div>
      </div>
      
      <p className="mt-8 text-sm text-zinc-400 text-center max-w-xs">
        Payments are securely processed by Razorpay.
      </p>
    </div>
  )
}
