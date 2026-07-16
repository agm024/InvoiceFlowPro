'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { FileText, Download, X } from 'lucide-react'

export default function PayClientPage({ invoice, upiUrl, upiId, settings }: { invoice: any, upiUrl: string, upiId: string, settings: any }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const isPaid = invoice.status === 'paid'

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = invoiceRef.current
      if (!element) return

      // Temporarily enforce desktop width for pristine A4 PDF generation
      const originalWidth = element.style.width
      const originalMaxWidth = element.style.maxWidth
      const originalPosition = element.style.position
      element.style.width = '800px'
      element.style.maxWidth = '800px'
      element.style.position = 'relative'

      const opt: any = {
        margin:       10,
        filename:     `Invoice_${invoice.invoiceNumber}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, windowWidth: 800 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()

      // Restore UI styles
      element.style.width = originalWidth
      element.style.maxWidth = originalMaxWidth
      element.style.position = originalPosition
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      alert('Failed to download PDF. Please try printing instead.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Main Payment Card */}
      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-sidebar-bg p-8 text-center border-b border-card-border">
          <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-2">Invoice {invoice.invoiceNumber}</h2>
          <h1 className="text-4xl font-bold text-foreground mb-2">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</h1>
          <p className="text-zinc-500 text-sm">Issued on {format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
          
          {isPaid && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 text-green-500 font-semibold text-sm">
              ✓ Paid in full
            </div>
          )}
        </div>

        {/* Paid Status - Thank You Message */}
        {isPaid && (
          <div className="p-8 pb-0">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-green-700 mb-2">Thank You!</h3>
              <p className="text-green-600 font-medium">This invoice has been fully paid.</p>
            </div>
          </div>
        )}

        {/* UPI Section */}
        {!isPaid && invoice.paymentMethod === 'UPI' && (
          <div className="p-8 flex flex-col items-center">
            <h3 className="text-lg font-medium text-foreground mb-6">Scan to Pay via UPI</h3>
            
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-zinc-200">
              <QRCodeSVG value={upiUrl} size={200} level="M" />
            </div>
            
            <div className="bg-sidebar-bg w-full rounded-lg p-4 flex justify-between items-center border border-sidebar-border mb-6">
              <span className="text-zinc-500 text-sm">UPI ID</span>
              <span className="font-medium text-foreground">{upiId}</span>
            </div>
          </div>
        )}

        {/* BANK Section */}
        {!isPaid && invoice.paymentMethod === 'BANK' && invoice.bank && (
          <div className="p-8 flex flex-col items-center">
            <h3 className="text-lg font-medium text-foreground mb-4">Bank Transfer</h3>
            
            <div className="bg-sidebar-bg w-full rounded-lg p-4 flex flex-col gap-3 border border-sidebar-border mb-6">
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">Bank Name</span><span className="font-medium text-foreground">{invoice.bank.bankName}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">A/C Number</span><span className="font-medium text-foreground">{invoice.bank.accountNumber}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 text-sm">IFSC Code</span><span className="font-medium text-foreground">{invoice.bank.ifsc}</span></div>
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
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Download size={18} /> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
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
            <button onClick={() => setDrawerOpen(false)} className="text-zinc-500 hover:text-foreground">
              <X size={24} />
            </button>
          </div>
          
          {/* Scrollable Invoice Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 relative">
            <div ref={invoiceRef} className="bg-white text-black p-6 sm:p-12 min-h-full rounded-xl shadow-sm border border-zinc-200 relative overflow-hidden text-sm sm:text-base">
              
              {isPaid && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="text-6xl sm:text-8xl md:text-[120px] font-black text-green-500 opacity-10 rotate-[-30deg] select-none tracking-widest border-4 sm:border-8 border-green-500 rounded-3xl p-4 sm:p-6">
                    PAID
                  </div>
                </div>
              )}
              
              <div className="relative z-10">
                {/* This mimics the layout of the actual PDF print view */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-12 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-1">INVOICE</h1>
                  <p className="text-zinc-500 font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div className="sm:text-right">
                  <h3 className="font-bold text-zinc-900">{settings?.companyName || 'Your Company Name'}</h3>
                  {settings?.address && <p className="text-zinc-500 text-sm whitespace-pre-wrap">{settings.address}</p>}
                  {settings?.gstin && <p className="text-zinc-500 text-sm mt-1">GSTIN: {settings.gstin}</p>}
                  {invoice.invoiceType === 'EXPORT' && settings?.lutNo && <p className="text-zinc-500 text-sm mt-1">LUT No: {settings.lutNo}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-12 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Billed To</h3>
                  <p className="font-bold text-zinc-900">{invoice.client.name}</p>
                  {invoice.client.address && <p className="text-zinc-600 text-sm whitespace-pre-wrap">{invoice.client.address}</p>}
                  {(invoice.client.phone || invoice.client.email) && (
                    <p className="text-zinc-600 text-sm mt-1">
                      {invoice.client.phone && <span>{invoice.client.phone}</span>}
                      {invoice.client.phone && invoice.client.email && <span className="mx-2">|</span>}
                      {invoice.client.email && <span>{invoice.client.email}</span>}
                    </p>
                  )}
                  {invoice.client.gstin && <p className="text-zinc-600 text-sm mt-1">GSTIN: {invoice.client.gstin}</p>}
                </div>
                <div className="sm:text-right">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Invoice Date</h3>
                  <p className="font-medium text-zinc-900">{format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
                  {invoice.dueDate && (
                    <>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 mt-4">Due Date</h3>
                      <p className="font-medium text-zinc-900">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left mb-8 sm:mb-12 min-w-[500px]">
                <thead className="bg-zinc-50 text-zinc-500 border-b-2 border-zinc-200 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-bold">Description</th>
                    <th className="px-4 py-3 font-bold text-right">HSN</th>
                    <th className="px-4 py-3 font-bold text-right">Qty</th>
                    <th className="px-4 py-3 font-bold text-right">Price</th>
                    <th className="px-4 py-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {invoice.items.map((item: any) => (
                    <tr key={item.id} className="text-zinc-800">
                      <td className="px-4 py-4 font-medium">{item.product.name}</td>
                      <td className="px-4 py-4 text-right text-zinc-500">{item.product.hsn || '-'}</td>
                      <td className="px-4 py-4 text-right">{item.quantity}</td>
                      <td className="px-4 py-4 text-right">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-medium">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{((item.price * item.quantity) + item.tax).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <div className="flex justify-end mb-8 sm:mb-12">
                <div className="w-full sm:w-64">
                  <div className="flex justify-between mb-3 text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.subTotal.toFixed(2)}</span>
                  </div>
                  {invoice.invoiceType !== 'EXPORT' && (
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-zinc-500">Total Tax (GST)</span>
                      <span className="font-medium text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.taxTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.discountValue > 0 && (
                    <div className="flex justify-between mb-3 text-sm text-green-600">
                      <span>Discount ({invoice.discountType === 'PERCENTAGE' ? invoice.discountValue + '%' : 'Flat'})</span>
                      <span className="font-medium">- {invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.discountType === 'FLAT' ? invoice.discountValue.toFixed(2) : ((invoice.subTotal + invoice.taxTotal) * (invoice.discountValue / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.roundOff !== 0 && (
                    <div className="flex justify-between mb-4 text-sm">
                      <span className="text-zinc-500">Round Off</span>
                      <span className="font-medium text-zinc-900">{invoice.roundOff > 0 ? '+' : ''}{invoice.roundOff.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t-2 border-zinc-200 text-lg font-bold">
                    <span className="text-zinc-900">Total</span>
                    <span className="text-zinc-900">{invoice.currency === 'INR' ? '₹' : invoice.currency + ' '}{invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="pt-8 border-t border-zinc-200">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Notes</h3>
                  <p className="text-sm text-zinc-600 whitespace-pre-wrap">{invoice.notes}</p>
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
