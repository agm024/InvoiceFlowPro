import prisma from '@/utils/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import Script from 'next/script'

export default async function InvoicePrintView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      bank: true,
      items: {
        include: { product: true }
      }
    }
  })
  
  const settings = await prisma.companySettings.findUnique({ where: { id: 'default' } })
  
  if (!invoice) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-24 print:p-0 print:bg-white print:text-black font-sans relative">
      {invoice.status === 'paid' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <div className="text-[150px] font-black text-green-500 opacity-10 rotate-[-30deg] select-none tracking-widest border-8 border-green-500 rounded-3xl p-8">
            PAID
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-2">INVOICE</h1>
            <p className="text-xl text-zinc-500 font-medium">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-zinc-900">{settings?.companyName || 'Your Company Name'}</h3>
            {settings?.address && <p className="text-zinc-500 whitespace-pre-wrap">{settings.address}</p>}
            {settings?.gstin && <p className="text-zinc-500 mt-2">GSTIN: {settings.gstin}</p>}
            {invoice.invoiceType === 'EXPORT' && settings?.lutNo && <p className="text-zinc-500 mt-1">LUT No: {settings.lutNo}</p>}
          </div>
        </div>

        <div className="flex justify-between mb-16">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Billed To</h3>
            <p className="font-bold text-zinc-900 text-lg">{invoice.client.name}</p>
            {invoice.client.address && <p className="text-zinc-600 whitespace-pre-wrap">{invoice.client.address}</p>}
            {(invoice.client.phone || invoice.client.email) && (
              <p className="text-zinc-600 mt-1">
                {invoice.client.phone && <span>{invoice.client.phone}</span>}
                {invoice.client.phone && invoice.client.email && <span className="mx-2">|</span>}
                {invoice.client.email && <span>{invoice.client.email}</span>}
              </p>
            )}
            {invoice.client.gstin && <p className="text-zinc-600 mt-2">GSTIN: <span className="font-medium text-zinc-900">{invoice.client.gstin}</span></p>}
          </div>
          <div className="text-right flex gap-12">
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Invoice Date</h3>
              <p className="font-medium text-zinc-900">{format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
            </div>
            {invoice.dueDate && (
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Due Date</h3>
                <p className="font-medium text-zinc-900">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
              </div>
            )}
          </div>
        </div>

        <table className="w-full text-left mb-16">
          <thead className="border-b-2 border-zinc-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-4 font-bold text-zinc-400">Description</th>
              <th className="py-4 font-bold text-zinc-400 text-right">Qty</th>
              <th className="py-4 font-bold text-zinc-400 text-right">Price</th>
              <th className="py-4 font-bold text-zinc-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoice.items.map((item) => (
              <tr key={item.id} className="text-zinc-800">
                <td className="py-5">
                  <p className="font-bold">{item.product.name}</p>
                  {item.product.hsn && <p className="text-sm text-zinc-500 mt-1">HSN: {item.product.hsn}</p>}
                </td>
                <td className="py-5 text-right font-medium">{item.quantity}</td>
                <td className="py-5 text-right font-medium">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{item.price.toFixed(2)}</td>
                <td className="py-5 text-right font-bold text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{((item.price * item.quantity) + item.tax).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-end mb-16">
          <div className="w-80">
            {invoice.status === 'paid' ? (
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h3 className="text-lg font-bold text-green-700 mb-2">Thank You!</h3>
                <p className="text-green-600 font-medium">This invoice has been fully paid.</p>
              </div>
            ) : (
              <>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Convenient, Localized Payment</h3>
                    <p className="text-zinc-500 text-xs mb-3 font-medium">To ensure a smooth and fee-free transaction, please remit payment using our localized banking details below.</p>
                    <p className="text-zinc-900 font-medium text-sm mb-1">Bank Name: <span className="font-normal">{invoice.bank.bankName}</span></p>
                    
                    {invoice.currency === 'USD' ? (
                      <>
                        <p className="text-zinc-900 font-medium text-sm mb-1">Account Number: <span className="font-normal">{invoice.bank.accountNumber}</span></p>
                        {invoice.bank.routingNumber && <p className="text-zinc-900 font-medium text-sm mb-1">ABA Routing Number: <span className="font-normal">{invoice.bank.routingNumber}</span></p>}
                        <p className="text-zinc-500 text-xs italic mt-2 border-t border-zinc-100 pt-2">Accepts local ACH and Wire transfers.</p>
                      </>
                    ) : invoice.currency === 'GBP' ? (
                      <>
                        <p className="text-zinc-900 font-medium text-sm mb-1">Account Number: <span className="font-normal">{invoice.bank.accountNumber}</span></p>
                        {invoice.bank.routingNumber && <p className="text-zinc-900 font-medium text-sm mb-1">Sort Code: <span className="font-normal">{invoice.bank.routingNumber.length === 6 ? invoice.bank.routingNumber.match(/.{1,2}/g)?.join('-') : invoice.bank.routingNumber}</span></p>}
                        <p className="text-zinc-500 text-xs italic mt-2 border-t border-zinc-100 pt-2">Accepts local UK Faster Payments (FPS) and BACS.</p>
                      </>
                    ) : invoice.currency === 'EUR' ? (
                      <>
                        {invoice.bank.iban && <p className="text-zinc-900 font-medium text-sm mb-1">IBAN: <span className="font-normal">{invoice.bank.iban}</span></p>}
                        {invoice.bank.swiftCode && <p className="text-zinc-900 font-medium text-sm mb-1">SWIFT / BIC Code: <span className="font-normal">{invoice.bank.swiftCode}</span></p>}
                        <p className="text-zinc-500 text-xs italic mt-2 border-t border-zinc-100 pt-2">Accepts SEPA Credit Transfers and International SWIFT.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-zinc-900 font-medium text-sm mb-1">A/C No: <span className="font-normal">{invoice.bank.accountNumber}</span></p>
                        {invoice.bank.ifsc && <p className="text-zinc-900 font-medium text-sm mb-1">IFSC: <span className="font-normal">{invoice.bank.ifsc}</span></p>}
                      </>
                    )}
                  </div>
                )}
                {invoice.paymentMethod === 'UPI' && settings?.upiId && (
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">UPI Details</h3>
                    <div className="flex items-center gap-4">
                      <QRCodeSVG 
                        value={`upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.companyName || '')}&am=${invoice.total}&cu=INR`} 
                        size={80} 
                        level="M" 
                      />
                      <div>
                        <p className="text-zinc-900 font-medium text-sm">Scan to Pay</p>
                        <p className="text-zinc-900 font-medium">UPI ID: <span className="font-normal">{settings.upiId}</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="w-80">
            <div className="flex justify-between mb-4 text-base">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.subTotal.toFixed(2)}</span>
            </div>
            {invoice.invoiceType !== 'EXPORT' && (
              <div className="flex justify-between mb-4 text-base">
                <span className="text-zinc-500">Total Tax (GST)</span>
                <span className="font-medium text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.taxTotal.toFixed(2)}</span>
              </div>
            )}
            {invoice.discountValue > 0 && (
              <div className="flex justify-between mb-4 text-base text-green-600">
                <span>Discount ({invoice.discountType === 'PERCENTAGE' ? invoice.discountValue + '%' : 'Flat'})</span>
                <span className="font-medium">- {invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.discountType === 'FLAT' ? invoice.discountValue.toFixed(2) : ((invoice.subTotal + invoice.taxTotal) * (invoice.discountValue / 100)).toFixed(2)}</span>
              </div>
            )}
            {invoice.roundOff !== 0 && (
              <div className="flex justify-between mb-4 text-base">
                <span className="text-zinc-500">Round Off</span>
                <span className="font-medium text-zinc-900">{invoice.roundOff > 0 ? '+' : ''}{invoice.roundOff.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-6 border-t-2 border-zinc-900 text-2xl font-bold">
              <span className="text-zinc-900">Total</span>
              <span className="text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="pt-12 border-t-2 border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Notes & Terms</h3>
            <p className="text-zinc-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

      </div>
      
      {/* Auto-print script for convenience */}
      <Script id="auto-print" strategy="lazyOnload">
        {`window.print();`}
      </Script>
    </div>
  )
}
