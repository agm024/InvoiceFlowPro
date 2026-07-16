'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Eye, Link as LinkIcon, Trash2, X } from 'lucide-react'

export default function InvoiceRowActions({ invoice, settings, onDelete }: { invoice: any, settings: any, onDelete: (id: string) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const isPaid = invoice.status === 'paid'

  const copyLink = () => {
    const url = `${window.location.origin}/pay/${encodeURIComponent(invoice.invoiceNumber)}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <button 
          onClick={copyLink}
          className="text-zinc-500 hover:text-foreground p-2 rounded-md hover:bg-sidebar-border transition-colors"
          title="Copy Public Link"
        >
          {copied ? <span className="text-xs font-medium text-green-500">Copied!</span> : <LinkIcon size={16} />}
        </button>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="text-zinc-500 hover:text-foreground p-2 rounded-md hover:bg-sidebar-border transition-colors"
          title="Quick View"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={() => onDelete(invoice.id)}
          className="text-red-500 hover:text-red-600 p-2 rounded-md hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Slide-out Invoice Preview Drawer (identical to public link drawer) */}
      <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        
        <div className={`relative w-full max-w-2xl bg-card-bg h-full shadow-2xl flex flex-col transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-card-border">
            <h2 className="text-xl font-semibold text-foreground">Invoice Quick View</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-zinc-500 hover:text-foreground">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="bg-white text-black p-8 sm:p-12 min-h-full rounded-xl shadow-sm border border-zinc-200 relative overflow-hidden text-left">
              
              {isPaid && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="text-8xl md:text-[120px] font-black text-green-500 opacity-10 rotate-[-30deg] select-none tracking-widest border-8 border-green-500 rounded-3xl p-6">
                    PAID
                  </div>
                </div>
              )}
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-1">INVOICE</h1>
                    <p className="text-zinc-500 font-medium">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-zinc-900">{settings?.companyName || 'Your Company Name'}</h3>
                    {settings?.address && <p className="text-zinc-500 text-sm whitespace-pre-wrap">{settings.address}</p>}
                    {settings?.gstin && <p className="text-zinc-500 text-sm mt-1">GSTIN: {settings.gstin}</p>}
                  </div>
                </div>

                <div className="flex justify-between mb-12">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Billed To</h3>
                    <p className="font-bold text-zinc-900">{invoice.client.name}</p>
                    <p className="text-zinc-600 text-sm whitespace-pre-wrap">{invoice.client.address}</p>
                    {invoice.client.gstin && <p className="text-zinc-600 text-sm mt-1">GSTIN: {invoice.client.gstin}</p>}
                  </div>
                  <div className="text-right">
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

                <table className="w-full text-sm text-left mb-12">
                  <thead className="bg-zinc-50 text-zinc-500 border-b-2 border-zinc-200 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-bold">Description</th>
                      <th className="px-4 py-3 font-bold text-right">Qty</th>
                      <th className="px-4 py-3 font-bold text-right">Price</th>
                      <th className="px-4 py-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {invoice.items.map((item: any) => (
                      <tr key={item.id} className="text-zinc-800">
                        <td className="px-4 py-4 font-medium">{item.product.name}</td>
                        <td className="px-4 py-4 text-right">{item.quantity}</td>
                        <td className="px-4 py-4 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right font-medium">₹{((item.price * item.quantity) + item.tax).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-12">
                  <div className="w-64">
                    <div className="flex justify-between mb-3 text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-medium text-zinc-900">₹{invoice.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                      <span className="text-zinc-500">Total Tax</span>
                      <span className="font-medium text-zinc-900">₹{invoice.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t-2 border-zinc-200 text-lg font-bold">
                      <span className="text-zinc-900">Total</span>
                      <span className="text-zinc-900">₹{invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-card-border bg-sidebar-bg flex justify-end gap-4">
            <a 
              href={`/pay/${encodeURIComponent(invoice.invoiceNumber)}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-4 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Print / PDF
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
