'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { FileText, X, Printer, CheckCircle } from 'lucide-react'
import { getStateNameByCode } from '@/utils/stateCodes'

export default function PayClientPage({ invoice, upiUrl, upiId, settings }: { invoice: any, upiUrl: string, upiId: string, settings: any }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const isPaid = invoice.status === 'paid'

  const handleDownload = () => {
    window.open(`/pay/${encodeURIComponent(invoice.invoiceNumber)}/print`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Main Payment Card */}
      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-sidebar-bg p-8 text-center border-b border-card-border">
          <h2 className="text-[#71717a] text-sm font-medium uppercase tracking-wider mb-2">Invoice {invoice.invoiceNumber}</h2>
          
          {isPaid ? (
            <h1 className="text-4xl font-bold text-foreground mb-2">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</h1>
          ) : invoice.amountPaid > 0 ? (
            <div className="flex flex-col items-center justify-center mb-2 mt-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Remaining Balance</span>
              <h1 className="text-4xl font-bold text-foreground">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{(invoice.total - invoice.amountPaid).toFixed(2)}</h1>
              <p className="text-sm font-medium text-zinc-400 mt-2">
                Original Total: <span>{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</span>
              </p>
            </div>
          ) : (
            <h1 className="text-4xl font-bold text-foreground mb-2">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</h1>
          )}

          <p className="text-[#71717a] text-sm">Issued on {format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
          
          {isPaid && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-[#22c55e] font-semibold text-sm">
              ✓ Paid in full
            </div>
          )}
        </div>

        {/* Paid Status - Thank You Message */}
        {isPaid && (
          <div className="p-8 pb-0">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">Thank You!</h3>
              <p className="text-[#16a34a] font-medium">This invoice has been fully paid.</p>
            </div>
          </div>
        )}

        {/* UPI Section */}
        {!isPaid && invoice.paymentMethod === 'UPI' && (
          <div className="p-8 flex flex-col items-center">
            <h3 className="text-lg font-medium text-foreground mb-6">Scan to Pay via UPI</h3>
            
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-[#e4e4e7]">
              <QRCodeSVG value={upiUrl} size={200} level="M" />
            </div>
            
            <div className="bg-sidebar-bg w-full rounded-lg p-4 flex justify-between items-center border border-sidebar-border mb-6">
              <span className="text-[#71717a] text-sm">UPI ID</span>
              <span className="font-medium text-foreground">{upiId}</span>
            </div>
          </div>
        )}

        {/* BANK Section */}
        {!isPaid && invoice.paymentMethod === 'BANK' && invoice.bank && (
          <div className="p-8 flex flex-col items-center">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-foreground">Convenient, Localized Payment</h3>
              <p className="text-[#71717a] text-sm mt-1">To ensure a smooth and fee-free transaction, please remit payment using our localized banking details below.</p>
            </div>
            
            <div className="bg-sidebar-bg w-full rounded-lg p-4 flex flex-col gap-3 border border-sidebar-border mb-6">
              <div className="flex justify-between"><span className="text-[#71717a] text-sm">Bank Name</span><span className="font-medium text-foreground">{invoice.bank.bankName}</span></div>
              
              {invoice.currency === 'USD' ? (
                <>
                  <div className="flex justify-between"><span className="text-[#71717a] text-sm">Account Number</span><span className="font-medium text-foreground">{invoice.bank.accountNumber}</span></div>
                  {invoice.bank.routingNumber && <div className="flex justify-between"><span className="text-[#71717a] text-sm">ABA Routing Number</span><span className="font-medium text-foreground">{invoice.bank.routingNumber}</span></div>}
                  <div className="text-xs text-[#71717a] mt-2 italic text-center border-t border-sidebar-border pt-2">Accepts local ACH and Wire transfers.</div>
                </>
              ) : invoice.currency === 'GBP' ? (
                <>
                  <div className="flex justify-between"><span className="text-[#71717a] text-sm">Account Number</span><span className="font-medium text-foreground">{invoice.bank.accountNumber}</span></div>
                  {invoice.bank.routingNumber && <div className="flex justify-between"><span className="text-[#71717a] text-sm">Sort Code</span><span className="font-medium text-foreground">{invoice.bank.routingNumber.length === 6 ? invoice.bank.routingNumber.match(/.{1,2}/g)?.join('-') : invoice.bank.routingNumber}</span></div>}
                  <div className="text-xs text-[#71717a] mt-2 italic text-center border-t border-sidebar-border pt-2">Accepts local UK Faster Payments (FPS) and BACS.</div>
                </>
              ) : invoice.currency === 'EUR' ? (
                <>
                  {invoice.bank.iban && <div className="flex justify-between"><span className="text-[#71717a] text-sm">IBAN</span><span className="font-medium text-foreground">{invoice.bank.iban}</span></div>}
                  {invoice.bank.swiftCode && <div className="flex justify-between"><span className="text-[#71717a] text-sm">SWIFT / BIC Code</span><span className="font-medium text-foreground">{invoice.bank.swiftCode}</span></div>}
                  <div className="text-xs text-[#71717a] mt-2 italic text-center border-t border-sidebar-border pt-2">Accepts SEPA Credit Transfers and International SWIFT.</div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-[#71717a] text-sm">A/C Number</span><span className="font-medium text-foreground">{invoice.bank.accountNumber}</span></div>
                  {invoice.bank.ifsc && <div className="flex justify-between"><span className="text-[#71717a] text-sm">IFSC Code</span><span className="font-medium text-foreground">{invoice.bank.ifsc}</span></div>}
                </>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-8 pt-0 flex flex-col gap-3">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-sidebar-bg text-foreground border border-sidebar-border px-6 py-3 rounded-xl font-medium hover:bg-sidebar-border transition-colors"
          >
            <FileText size={18} /> View Invoice Details
          </button>
          
          <button 
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Slide-out Invoice Preview Drawer */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        
        {/* Drawer Panel */}
        <div className={`relative w-full max-w-2xl bg-card-bg h-full shadow-2xl flex flex-col transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-card-border">
            <h2 className="text-xl font-semibold text-foreground">Invoice Preview</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-[#71717a] hover:text-foreground">
              <X size={24} />
            </button>
          </div>
          
          {/* Scrollable Invoice Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 relative">
            <div ref={invoiceRef} className="bg-white text-black p-6 sm:p-12 min-h-full rounded-xl shadow-sm border border-[#e4e4e7] relative overflow-hidden text-sm sm:text-base">
              
              {isPaid && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                  <div className="text-[120px] font-black text-[#22c55e] opacity-10 rotate-[-30deg] select-none tracking-widest border-8 border-[#22c55e] rounded-3xl p-6">
                    PAID
                  </div>
                </div>
              )}
              
              <div className="relative z-10">
                {/* This mimics the layout of the actual PDF print view */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 border-b pb-6 border-[#e4e4e7]">
                  <div>
                    <h1 className="text-[#2563eb] font-bold uppercase tracking-wider text-xl mb-4">{invoice.invoiceType === 'QUOTATION' ? 'QUOTATION' : 'TAX INVOICE'}</h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] mb-2 uppercase">{settings?.companyName || 'Your Company Name'}</h2>
                    
                    <div className="text-[#27272a] text-sm font-medium mb-1">
                      {settings?.gstin && <span>GSTIN {settings.gstin}</span>}
                      {settings?.gstin && settings?.panNo && <span className="mx-2">PAN</span>}
                      {settings?.panNo && <span>{settings.panNo}</span>}
                    </div>
                    
                    {settings?.address && <p className="text-[#3f3f46] text-sm whitespace-pre-wrap mb-1 leading-snug">{settings.address}</p>}
                    
                    {settings?.email && <p className="text-[#3f3f46] text-sm mb-0.5"><span className="font-semibold">Email</span> {settings.email}</p>}
                    {settings?.website && <p className="text-[#3f3f46] text-sm mb-0.5"><span className="font-semibold">Website</span> {settings.website}</p>}
                  </div>
                  
                  <div className="sm:text-right flex flex-col items-end">
                    <p className="text-[#71717a] text-xs font-bold tracking-widest uppercase mb-4">ORIGINAL FOR RECIPIENT</p>
                    {settings?.logoUrl && (
                      <img src={settings.logoUrl} alt="Company Logo" className="w-32 h-32 object-contain bg-black rounded" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between text-sm font-medium text-[#18181b] mb-8 pb-6 border-b border-[#e4e4e7]">
                  <div><span className="text-[#71717a] mr-1">Invoice #:</span> {invoice.invoiceNumber}</div>
                  <div><span className="text-[#71717a] mr-1">Invoice Date:</span> {format(new Date(invoice.date), 'dd MMM yyyy')}</div>
                  {invoice.dueDate && <div><span className="text-[#71717a] mr-1">Due Date:</span> {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</div>}
                </div>

              <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-12 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#27272a] mb-1">Customer Details:</h3>
                  <p className="font-bold text-[#18181b] mb-1">{invoice.client.name}</p>
                  {invoice.client.phone && <p className="text-[#3f3f46] text-sm">Ph: {invoice.client.phone}</p>}
                  {invoice.client.email && <p className="text-[#3f3f46] text-sm">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-[#3f3f46] text-sm whitespace-pre-wrap mt-1">{invoice.client.address}</p>}
                  
                  {(invoice.client.stateCode || invoice.client.stateName) && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-[#27272a] mb-1">Place of Supply:</h3>
                      <p className="font-bold text-[#18181b] text-sm uppercase">
                        {invoice.client.stateCode ? `${invoice.client.stateCode}-` : ''}{invoice.client.stateName || getStateNameByCode(invoice.client.stateCode)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left mb-0 min-w-[500px]">
                <thead className="bg-[#f0f9ff] text-[#2563eb] border-b-2 border-[#2563eb] font-semibold text-xs">
                  <tr>
                    <th className="px-2 py-3">#</th>
                    <th className="px-2 py-3">Item</th>
                    <th className="px-2 py-3 text-right">Rate / Item</th>
                    <th className="px-2 py-3 text-center">Qty</th>
                    <th className="px-2 py-3 text-right">Taxable Value</th>
                    {invoice.invoiceType !== 'EXPORT' && <th className="px-2 py-3 text-right">Tax Amount</th>}
                    <th className="px-2 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] border-b border-[#e4e4e7]">
                  {invoice.items.map((item: any, idx: number) => (
                    <tr key={item.id} className="text-[#18181b]">
                      <td className="px-2 py-3 align-top">{idx + 1}</td>
                      <td className="px-2 py-3 align-top">
                        <div className="font-semibold">{item.product.name}</div>
                        {item.product.hsn && <div className="text-[#71717a] text-xs mt-0.5">SAC: {item.product.hsn}</div>}
                      </td>
                      <td className="px-2 py-3 text-right align-top">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-2 py-3 text-center align-top">{item.quantity}</td>
                      <td className="px-2 py-3 text-right align-top">{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      {invoice.invoiceType !== 'EXPORT' && (
                        <td className="px-2 py-3 text-right align-top">
                          {item.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {item.product.gstRate > 0 && <span className="text-xs text-[#71717a] ml-1">({item.product.gstRate}%)</span>}
                        </td>
                      )}
                      <td className="px-2 py-3 text-right align-top">{((item.price * item.quantity) + item.tax).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <div className="flex justify-end mb-4">
                <div className="w-full sm:w-80">
                  <div className="flex justify-between py-1 text-sm font-semibold">
                    <span className="text-[#18181b]">Taxable Amount</span>
                    <span className="text-[#18181b]">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {invoice.invoiceType !== 'EXPORT' && invoice.taxTotal > 0 && (
                    <>
                      <div className="flex justify-between py-1 text-sm font-semibold">
                        <span className="text-[#18181b]">CGST</span>
                        <span className="text-[#18181b]">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{(invoice.taxTotal / 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm font-semibold">
                        <span className="text-[#18181b]">SGST</span>
                        <span className="text-[#18181b]">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{(invoice.taxTotal / 2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                  {invoice.discountValue > 0 && (
                    <div className="flex justify-between py-1 text-sm text-[#16a34a] font-semibold">
                      <span>Discount ({invoice.discountType === 'PERCENTAGE' ? invoice.discountValue + '%' : 'Flat'})</span>
                      <span>- {invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.discountType === 'FLAT' ? invoice.discountValue.toFixed(2) : ((invoice.subTotal + invoice.taxTotal) * (invoice.discountValue / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.roundOff !== 0 && (
                    <div className="flex justify-between py-1 text-sm font-semibold">
                      <span className="text-[#18181b]">Round Off</span>
                      <span className="text-[#18181b]">{invoice.roundOff > 0 ? '+' : ''}{invoice.roundOff.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b-2 border-t border-[#18181b] text-lg font-bold">
                    <span className="text-[#18181b]">Total</span>
                    <span className="text-[#18181b]">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {(invoice.amountPaid > 0 && invoice.amountPaid < invoice.total) && (
                    <>
                      <div className="flex justify-between py-1 mt-1 text-sm font-semibold">
                        <span className="text-[#16a34a]">Amount Paid</span>
                        <span className="text-[#16a34a]">- {invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-2 bg-[#fef2f2] px-2 -mx-2 rounded text-base font-bold text-[#dc2626]">
                        <span>Balance Due</span>
                        <span>{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{(invoice.total - invoice.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between text-xs mb-2 gap-4">
                <div className="text-[#52525b]">Total Items / Qty : {invoice.items.length} / {invoice.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</div>
                <div className="text-[#52525b]">Total amount (in words): {invoice.currency} {invoice.total} Only.</div>
              </div>
              
              <div className="flex justify-end mb-8">
                {isPaid && (
                  <div className="inline-flex items-center gap-1 text-[#16a34a] font-bold text-sm bg-white">
                    <CheckCircle size={16} className="fill-[#16a34a] text-white" /> Amount Paid
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="flex gap-8">
                  {/* UPI Section */}
                  {!isPaid && invoice.paymentMethod === 'UPI' && upiUrl ? (
                    <div>
                      <h4 className="text-sm font-semibold text-[#18181b] mb-2">Pay using UPI:</h4>
                      <QRCodeSVG value={upiUrl} size={100} level="M" />
                    </div>
                  ) : <div></div>}
                  
                  {/* Bank Details */}
                  {!isPaid && invoice.paymentMethod === 'BANK' && invoice.bank ? (
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#18181b] mb-2">Bank Details:</h4>
                      <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-sm text-[#3f3f46]">
                        <span className="text-[#71717a]">Bank:</span>
                        <span className="font-semibold">{invoice.bank.bankName}</span>
                        <span className="text-[#71717a]">Account Holder:</span>
                        <span className="font-semibold uppercase">{settings?.companyName}</span>
                        
                        {invoice.currency === 'USD' ? (
                          <>
                            <span className="text-[#71717a]">Account #:</span>
                            <span className="font-semibold">{invoice.bank.accountNumber}</span>
                            {invoice.bank.routingNumber && <><span className="text-[#71717a]">Routing No:</span><span className="font-semibold">{invoice.bank.routingNumber}</span></>}
                          </>
                        ) : invoice.currency === 'GBP' ? (
                          <>
                            <span className="text-[#71717a]">Account #:</span>
                            <span className="font-semibold">{invoice.bank.accountNumber}</span>
                            {invoice.bank.routingNumber && <><span className="text-[#71717a]">Sort Code:</span><span className="font-semibold">{invoice.bank.routingNumber}</span></>}
                          </>
                        ) : invoice.currency === 'EUR' ? (
                          <>
                            {invoice.bank.iban && <><span className="text-[#71717a]">IBAN:</span><span className="font-semibold">{invoice.bank.iban}</span></>}
                            {invoice.bank.swiftCode && <><span className="text-[#71717a]">SWIFT/BIC:</span><span className="font-semibold">{invoice.bank.swiftCode}</span></>}
                          </>
                        ) : (
                          <>
                            <span className="text-[#71717a]">Account #:</span>
                            <span className="font-semibold">{invoice.bank.accountNumber}</span>
                            {invoice.bank.ifsc && <><span className="text-[#71717a]">IFSC Code:</span><span className="font-semibold">{invoice.bank.ifsc}</span></>}
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                
                <div className="flex flex-col items-end justify-end">
                  <div className="text-xs text-[#71717a] text-right w-48 font-medium">For {settings?.companyName?.toUpperCase()}</div>
                  <div className="h-16 mt-4 w-48">
                    {/* Placeholder for signature */}
                    <div className="w-full h-full font-['Great_Vibes',cursive] text-3xl flex items-end justify-end text-[#3f3f46] opacity-60">
                      {settings?.brandName || settings?.companyName}
                    </div>
                  </div>
                  <div className="text-xs text-[#71717a] mt-2">Authorized Signatory</div>
                </div>
              </div>

              {invoice.notes && (
                <div className="pt-4">
                  <h3 className="text-sm font-bold text-[#18181b] mb-1">Notes:</h3>
                  <p className="text-sm text-[#3f3f46] whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
