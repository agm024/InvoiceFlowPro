'use client'

import { useState } from 'react'
import { MoreHorizontal, Link as LinkIcon, Printer, CheckCircle, Clock } from 'lucide-react'
import { updateInvoiceStatus } from './actions'

export default function InvoiceActionsDropdown({ invoiceId }: { invoiceId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/pay/${invoiceId}`
    navigator.clipboard.writeText(url)
    alert('Public Invoice Link copied to clipboard!')
    setIsOpen(false)
  }

  const handlePrint = () => {
    // Navigate to print view or open in new tab
    window.open(`/pay/${invoiceId}/print`, '_blank')
    setIsOpen(false)
  }

  const handleMarkAsPaid = async () => {
    await updateInvoiceStatus(invoiceId, 'paid')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Actions <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card-bg border border-card-border z-20 overflow-hidden">
            <div className="py-1">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-bg flex items-center gap-2"
              >
                <LinkIcon size={16} /> Send Public Link
              </button>
              <button
                onClick={handlePrint}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-bg flex items-center gap-2"
              >
                <Printer size={16} /> Download / Print PDF
              </button>
              <div className="border-t border-card-border my-1"></div>
              <button
                onClick={handleMarkAsPaid}
                className="w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-green-500/10 flex items-center gap-2 font-medium"
              >
                <CheckCircle size={16} /> Mark as Paid
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
