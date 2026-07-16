'use client'

import { useState } from 'react'
import { MoreHorizontal, Link as LinkIcon, Printer, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateInvoiceStatus, convertToInvoice, recordPayment } from './actions'

interface Props {
  invoiceId: string;
  invoiceNumber: string;
  invoiceType: string;
  total: number;
  amountPaid: number;
  status: string;
}

export default function InvoiceActionsDropdown({ invoiceId, invoiceNumber, invoiceType, total, amountPaid, status }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState((total - amountPaid).toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/pay/${encodeURIComponent(invoiceNumber)}`
    navigator.clipboard.writeText(url)
    toast.success('Public Link copied to clipboard!')
    setIsOpen(false)
  }

  const handlePrint = () => {
    window.open(`/pay/${encodeURIComponent(invoiceNumber)}/print`, '_blank')
    setIsOpen(false)
  }

  const handleOpenPaymentModal = () => {
    setIsOpen(false)
    setPaymentAmount((total - amountPaid).toString())
    setIsModalOpen(true)
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      setIsSubmitting(false)
      return
    }

    const res = await recordPayment(invoiceId, amount)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(res.isFullyPaid ? 'Invoice marked as fully paid!' : 'Partial payment recorded!')
      setIsModalOpen(false)
    }
    setIsSubmitting(false)
  }

  const handleConvertToInvoice = async () => {
    const res = await convertToInvoice(invoiceId)
    if (res.success) {
      window.location.href = `/invoices/${res.newInvoiceId}`
    } else {
      toast.error('Failed to convert to invoice')
    }
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
              
              {invoiceType === 'QUOTATION' && (
                <>
                  <div className="border-t border-card-border my-1"></div>
                  <button
                    onClick={handleConvertToInvoice}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle size={16} /> Convert to Invoice
                  </button>
                </>
              )}

              {invoiceType !== 'QUOTATION' && status !== 'paid' && (
                <>
                  <div className="border-t border-card-border my-1"></div>
                  <button
                    onClick={handleOpenPaymentModal}
                    className="w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-green-500/10 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle size={16} /> Record Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
          <div className="bg-card-bg border border-card-border rounded-xl shadow-xl w-full max-w-sm relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-lg font-bold text-foreground mb-4">Record Payment</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-zinc-500 mb-1">
                <span>Total Amount:</span>
                <span className="font-medium text-foreground">{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500 mb-4">
                <span>Remaining Balance:</span>
                <span className="font-medium text-foreground">{(total - amountPaid).toFixed(2)}</span>
              </div>
            </div>
            <form onSubmit={handleSubmitPayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">Amount Received</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={(total - amountPaid).toFixed(2)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-card-border bg-sidebar-bg text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
