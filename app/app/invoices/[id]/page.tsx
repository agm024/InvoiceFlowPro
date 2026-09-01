import { getInvoiceDetails } from './actions'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { format } from 'date-fns'
import { Download, Edit, ArrowLeft, Send, CheckCircle2, ChevronRight, Share2, Receipt, Building2, User, Landmark, Building, Mail, Phone, CalendarDays, FileText } from 'lucide-react'
import InvoiceActionsDropdown from './InvoiceActionsDropdown'
import SendEmailButton from './SendEmailButton'
import StatusBadge from '@/components/StatusBadge'
import { getCurrencySymbol } from '@/utils/currency'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (id === 'new') {
    // Sometimes Next.js dev server routes /new here incorrectly. 
    // This forces a redirect to the correct static route to break the cache.
    const { redirect } = await import('next/navigation')
    redirect('/app/invoices/new')
  }

  const invoice = await getInvoiceDetails(id)
  
  if (!invoice) {
    notFound()
  }

  const { getCompanySettings } = await import('@/app/app/settings/actions')
  const companySettings = await getCompanySettings()

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/app/invoices" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
            &larr; Back to Invoices
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{invoice.invoiceNumber}</h1>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        
        {/* Actions Component */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <SendEmailButton 
            invoiceId={invoice.id} 
            invoiceNumber={invoice.invoiceNumber}
            total={invoice.total}
            status={invoice.status}
            clientName={invoice.client.name}
            clientEmail={invoice.client.email}
          />
          {invoice.status === 'draft' && (
            <Link href={`/app/invoices/${invoice.id}/edit`} className="text-sm bg-sidebar-bg border border-sidebar-border px-4 py-2 rounded-md font-medium text-foreground hover:bg-sidebar-border transition-colors">
              Edit Invoice
            </Link>
          )}
          <InvoiceActionsDropdown 
            invoiceId={invoice.id} 
            invoiceNumber={invoice.invoiceNumber}
            invoiceType={invoice.invoiceType} 
            total={invoice.total}
            amountPaid={invoice.amountPaid}
            status={invoice.status}
            clientName={invoice.client.name}
            clientEmail={invoice.client.email}
          />
        </div>
      </div>

      <div className="bg-white text-black rounded-xl shadow-sm overflow-hidden border border-zinc-200">
        <div className="p-10 md:p-14">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div>
              {companySettings?.logoUrl ? (
                <img src={companySettings.logoUrl} alt="Company Logo" className="h-16 w-auto object-contain mb-4" />
              ) : (
                <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center rounded-lg mb-4 text-zinc-400 font-bold text-xs uppercase text-center border border-zinc-200">
                  Logo
                </div>
              )}
              <h2 className="text-xl font-bold">{companySettings?.brandName || companySettings?.companyName}</h2>
              {companySettings?.address && <p className="text-sm text-zinc-600 whitespace-pre-wrap mt-1">{companySettings.address}</p>}
              <div className="text-sm text-zinc-600 mt-1 flex flex-wrap gap-x-2 gap-y-1">
                {companySettings?.email && <span>{companySettings.email}</span>}
                {companySettings?.email && companySettings?.phone && <span className="text-zinc-300">|</span>}
                {companySettings?.phone && <span>{companySettings.phone}</span>}
              </div>
              {companySettings?.gstin && <p className="text-sm text-zinc-600 mt-1 font-medium">GSTIN: {companySettings.gstin}</p>}
            </div>
            
            <div className="text-left md:text-right w-full md:w-auto flex flex-col md:items-end">
              <h1 className="text-4xl tracking-tighter font-black text-zinc-900 mb-2 uppercase">{invoice.invoiceType === 'QUOTATION' ? 'QUOTATION' : invoice.invoiceType === 'EXPORT' ? 'EXPORT INVOICE' : 'INVOICE'}</h1>
              <p className="text-lg font-bold text-zinc-900 mb-4">{invoice.invoiceNumber}</p>
              
              <table className="w-full md:w-auto text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 pr-6 font-semibold text-zinc-500">Date:</td>
                    <td className="py-1 font-medium">{format(new Date(invoice.date), 'dd MMM yyyy')}</td>
                  </tr>
                  {invoice.dueDate && (
                    <tr>
                      <td className="py-1 pr-6 font-semibold text-zinc-500">Due:</td>
                      <td className="py-1 font-medium">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</td>
                    </tr>
                  )}
                  {invoice.reference && (
                    <tr>
                      <td className="py-1 pr-6 font-semibold text-zinc-500">Reference:</td>
                      <td className="py-1 font-medium">{invoice.reference}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-1 pr-6 font-semibold text-zinc-500">Status:</td>
                    <td className="py-1">
                      <span className={`inline-flex items-center gap-1.5 font-bold uppercase text-xs ${
                        invoice.status === 'paid' ? 'text-emerald-600' :
                        invoice.status === 'sent' ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          invoice.status === 'paid' ? 'bg-emerald-500' :
                          invoice.status === 'sent' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-zinc-200 mb-8" />

          {/* Billing Info */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="w-full md:w-1/2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Bill From</h3>
              <p className="font-bold text-lg mb-1">{companySettings?.companyName}</p>
              <p className="text-sm text-zinc-600">{companySettings?.address}</p>
              {companySettings?.stateCode && <p className="text-sm text-zinc-600 mt-1">State Code: {companySettings.stateCode}</p>}
              {companySettings?.gstin && <p className="text-sm font-medium mt-1">GSTIN: {companySettings.gstin}</p>}
              {companySettings?.lutNo && invoice.invoiceType === 'EXPORT' && <p className="text-sm font-medium mt-1">LUT: {companySettings.lutNo}</p>}
            </div>
            
            <div className="w-full md:w-1/2 md:text-right">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Bill To</h3>
              <p className="font-bold text-lg mb-1">{invoice.client.name}</p>
              <p className="text-sm text-zinc-600 md:ml-auto whitespace-pre-wrap max-w-xs">{invoice.client.address}</p>
              {invoice.client.email && <p className="text-sm text-zinc-600 mt-1">{invoice.client.email}</p>}
              {invoice.client.phone && <p className="text-sm text-zinc-600 mt-1">{invoice.client.phone}</p>}
              {invoice.client.gstin && <p className="text-sm font-medium mt-1">GSTIN: <span className="uppercase">{invoice.client.gstin}</span></p>}
            </div>
          </div>

          <hr className="border-zinc-200 mb-8" />

          {/* Line Items */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 w-full min-w-[200px]">Description</th>
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-center px-4">Qty</th>
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right px-4">Rate</th>
                  {invoice.invoiceType === 'REGULAR' && <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right px-4">Tax</th>}
                  <th className="py-3 font-bold text-xs uppercase tracking-widest text-zinc-500 text-right pl-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-zinc-900">{item.product.name}</p>
                      {item.product.hsn && <p className="text-xs text-zinc-500 mt-1 font-medium">HSN/SAC: {item.product.hsn}</p>}
                    </td>
                    <td className="py-4 text-center px-4 font-medium text-zinc-700">{item.quantity}</td>
                    <td className="py-4 text-right px-4 font-medium text-zinc-700">{getCurrencySymbol(invoice.currency)}{item.price.toFixed(2)}</td>
                    {invoice.invoiceType === 'REGULAR' && <td className="py-4 text-right px-4 text-zinc-500 text-xs">{item.product.gstRate}%</td>}
                    <td className="py-4 text-right pl-4 font-bold text-zinc-900">{getCurrencySymbol(invoice.currency)}{((item.price * item.quantity) + item.tax).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-end mb-12">
            <div className="w-full md:w-80">
              <div className="flex justify-between py-2 text-sm">
                <span className="font-semibold text-zinc-600">Subtotal</span>
                <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.subTotal.toFixed(2)}</span>
              </div>
              
              {invoice.discountValue > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-semibold text-zinc-600">
                    Discount {invoice.discountType === 'PERCENTAGE' && `(${invoice.discountValue}%)`}
                  </span>
                  <span className="font-bold text-red-600">
                    -{getCurrencySymbol(invoice.currency)} 
                    {invoice.discountType === 'PERCENTAGE' 
                      ? ((invoice.subTotal * invoice.discountValue) / 100).toFixed(2)
                      : invoice.discountValue.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between py-2 text-sm border-b border-zinc-200">
                <span className="font-semibold text-zinc-600">Taxable Amount</span>
                <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.subTotal.toFixed(2)}</span>
              </div>

              {invoice.taxTotal > 0 && invoice.invoiceType === 'REGULAR' && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-semibold text-zinc-600">Total Tax</span>
                  <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.taxTotal.toFixed(2)}</span>
                </div>
              )}

              {/* Adjustments */}
              {((invoice as any).creditNotes?.length > 0 || (invoice as any).debitNotes?.length > 0) && (
                <div className="border-t border-zinc-200 pt-2 mt-2">
                  {(invoice as any).creditNotes?.map((cn: any) => (
                    <div key={cn.id} className="flex justify-between py-1 text-sm text-red-600">
                      <span className="font-medium">Credit Note ({cn.noteNumber})</span>
                      <span className="font-bold">- {getCurrencySymbol(invoice.currency)} {cn.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  {(invoice as any).debitNotes?.map((dn: any) => (
                    <div key={dn.id} className="flex justify-between py-1 text-sm text-blue-600">
                      <span className="font-medium">Debit Note ({dn.noteNumber})</span>
                      <span className="font-bold">+ {getCurrencySymbol(invoice.currency)} {dn.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between py-4 mt-2 border-t-2 border-zinc-900">
                <span className="font-black text-lg">TOTAL</span>
                <span className="font-black text-lg">{getCurrencySymbol(invoice.currency)} {invoice.total.toFixed(2)}</span>
              </div>
              
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between py-2 text-sm text-emerald-700 bg-emerald-50 px-3 rounded-lg mt-2">
                  <span className="font-bold">Amount Paid</span>
                  <span className="font-bold">{getCurrencySymbol(invoice.currency)} {invoice.amountPaid.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 text-base mt-2">
                <span className="font-bold text-zinc-600">Balance Due</span>
                <span className="font-black">
                  {getCurrencySymbol(invoice.currency)}{' '}
                  {Math.max(
                    0,
                    invoice.total -
                      (invoice.amountPaid || 0) -
                      ((invoice as any).creditNotes?.reduce((sum: number, cn: any) => sum + cn.amount, 0) || 0) +
                      ((invoice as any).debitNotes?.reduce((sum: number, dn: any) => sum + dn.amount, 0) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-zinc-200 mb-8" />

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Payment Information</h3>
              <table className="text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 pr-4 font-semibold text-zinc-600">Payment Status:</td>
                    <td className="py-1 font-bold">{invoice.status.toUpperCase()}</td>
                  </tr>
                  {invoice.paymentMethod && invoice.paymentMethod !== 'NONE' && (
                    <tr>
                      <td className="py-1 pr-4 font-semibold text-zinc-600">Method:</td>
                      <td className="py-1 font-medium uppercase">{invoice.paymentMethod}</td>
                    </tr>
                  )}
                  {invoice.bank && (
                    <tr>
                      <td className="py-1 pr-4 font-semibold text-zinc-600">Bank Details:</td>
                      <td className="py-1 font-medium">{invoice.bank.bankName} - {invoice.bank.accountNumber}</td>
                    </tr>
                  )}
                  {invoice.paymentId && (
                    <tr>
                      <td className="py-1 pr-4 font-semibold text-zinc-600">Transaction ID:</td>
                      <td className="py-1 font-medium">{invoice.paymentId}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              {invoice.notes && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Notes</h3>
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
              {/* Terms could be fetched from settings if we had it, but hardcoded placeholder for now */}
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-zinc-200 text-center text-zinc-500 text-sm">
            <p className="font-medium italic text-zinc-800 mb-2">Thank you for your business!</p>
            <p>This is a computer-generated invoice.</p>
          </div>

        </div>
      </div>
    </div>
  )
}

