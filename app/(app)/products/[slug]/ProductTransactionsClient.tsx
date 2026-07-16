'use client'

import { useState } from 'react'

export default function ProductTransactionsClient({ invoiceItems }: { invoiceItems: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = invoiceItems.filter(item => 
    item.invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Tabs */}
      <div className="px-8 pt-4 border-b border-sidebar-border">
        <div className="flex gap-8">
          <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">
            Bill-Wise Transactions
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-sidebar-bg/50 border-b border-sidebar-border flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search customer or bill..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-background border border-sidebar-border rounded-md text-sm focus:outline-none focus:border-blue-500 w-64" 
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-sidebar-bg/50 text-zinc-500 text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Bill #</th>
              <th className="px-6 py-4 font-semibold">Party Name</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Unit Price</th>
              <th className="px-6 py-4 font-semibold text-right">Price with Tax</th>
              <th className="px-6 py-4 font-semibold text-right">Qty</th>
              <th className="px-6 py-4 font-semibold text-right">Item Discount (%)</th>
              <th className="px-6 py-4 font-semibold text-right">Item Net</th>
              <th className="px-6 py-4 font-semibold text-right">Item Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sidebar-border text-foreground">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-zinc-500">
                  {invoiceItems.length === 0 ? 'No transactions found for this product.' : 'No transactions matching your search.'}
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const priceWithTax = item.price + item.tax
                const itemNet = item.price * item.quantity
                const itemTotal = priceWithTax * item.quantity

                return (
                  <tr key={item.id} className="hover:bg-sidebar-bg/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{item.invoice.invoiceNumber}</td>
                    <td className="px-6 py-4">{item.invoice.client.name}</td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(item.invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{priceWithTax.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">0</td>
                    <td className="px-6 py-4 text-right">{itemNet.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{itemTotal.toFixed(2)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
