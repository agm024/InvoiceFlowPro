'use client'

import { useState } from 'react'
import { MoreHorizontal, Link as LinkIcon, Printer, CheckCircle, Clock, Mail, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/ConfirmationModal'
import { updateInvoiceStatus, convertToInvoice, recordPayment } from './actions'

interface Props {
  invoiceId: string;
  invoiceNumber: string;
  invoiceType: string;
  total: number;
  amountPaid: number;
  status: string;
  clientName: string;
  clientEmail: string | null;
}

export default function InvoiceActionsDropdown({ invoiceId, invoiceNumber, invoiceType, total, amountPaid, status, clientName, clientEmail }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState((total - amountPaid).toString())
  const [paymentDate, setPaymentDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReminder, setIsSendingReminder] = useState(false)
  const [isSendingInvoice, setIsSendingInvoice] = useState(false)
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: 'reminder' | 'send' | null }>({ isOpen: false, type: null })
  
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailCc, setEmailCc] = useState('')
  const [emailBcc, setEmailBcc] = useState('')
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/pay/${invoiceId}`
    navigator.clipboard.writeText(url)
    toast.success('Public Link copied to clipboard!')
    setIsOpen(false)
  }

  const handlePrint = () => {
    window.open(`/pay/${invoiceId}/invoice?download=true`, '_blank')
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
    const form = e.target as HTMLFormElement
    const paymentId = (form.elements.namedItem('paymentId') as HTMLInputElement).value
    const pDate = (form.elements.namedItem('paymentDate') as HTMLInputElement)?.value

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      setIsSubmitting(false)
      return
    }

    const res = await recordPayment(invoiceId, amount, paymentId, pDate)
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
      window.location.href = `/app/invoices/${res.newInvoiceId}`
    } else {
      toast.error(res.error || 'Failed to convert to invoice')
    }
    setIsOpen(false)
  }

  const handleSendReminder = async () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setEmailSubject(`Payment Reminder: Invoice ${invoiceNumber}`)
    setEmailMessage(`This is a friendly reminder that an invoice on your account is currently pending payment.`)
    setEmailCc('')
    setEmailBcc('')
    setModalState({ isOpen: true, type: 'reminder' })
    setIsOpen(false)
  }

  const handleSendInvoice = async () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setEmailSubject(`Invoice Available: ${invoiceNumber}`)
    setEmailMessage(`A new invoice has been generated for you and is now available for review and payment.`)
    setEmailCc('')
    setEmailBcc('')
    setModalState({ isOpen: true, type: 'send' })
    setIsOpen(false)
  }

  const executeSendReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingReminder(true)
    const { sendPaymentReminder } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const ccList = emailCc ? emailCc.split(',').map(s => s.trim()).filter(s => s) : undefined;
    const bccList = emailBcc ? emailBcc.split(',').map(s => s.trim()).filter(s => s) : undefined;
    
    const res = await sendPaymentReminder(clientEmail!, clientName, invoiceNumber, invoiceId, formattedAmount, emailSubject, emailMessage, ccList, bccList)
    if (res.success) {
      toast.success(`Reminder sent successfully to ${clientEmail}!`)
      setModalState({ isOpen: false, type: null })
    } else {
      toast.error('Something went wrong. Try again.')
    }
    setIsSendingReminder(false)
  }

  const executeSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingInvoice(true)
    const { sendInvoiceEmail } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const ccList = emailCc ? emailCc.split(',').map(s => s.trim()).filter(s => s) : undefined;
    const bccList = emailBcc ? emailBcc.split(',').map(s => s.trim()).filter(s => s) : undefined;
    
    const res = await sendInvoiceEmail(clientEmail!, clientName, invoiceNumber, invoiceId, formattedAmount, emailSubject, emailMessage, ccList, bccList)
    if (res.success) {
      toast.success(`Invoice sent successfully to ${clientEmail}!`)
      if (status === 'draft') {
        await updateInvoiceStatus(invoiceId, 'sent')
      }
      setModalState({ isOpen: false, type: null })
    } else {
      toast.error('Something went wrong. Try again.')
    }
    setIsSendingInvoice(false)
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

              {clientEmail && (
                <button
                  onClick={handleSendInvoice}
                  disabled={isSendingInvoice}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-bg flex items-center gap-2 disabled:opacity-50"
                >
                  <Mail size={16} /> {isSendingInvoice ? 'Sending...' : 'Send via Email'}
                </button>
              )}

              {invoiceType !== 'QUOTATION' && status !== 'paid' && clientEmail && (
                <button
                  onClick={handleSendReminder}
                  disabled={isSendingReminder}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-bg flex items-center gap-2 disabled:opacity-50"
                >
                  <Clock size={16} /> {isSendingReminder ? 'Sending...' : 'Send Reminder'}
                </button>
              )}
              
              {invoiceType === 'QUOTATION' && (
                <>
                  <div className="border-t border-card-border my-1"></div>
                  <button
                    onClick={handleConvertToInvoice}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:bg-zinc-800 flex items-center gap-2 font-medium"
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
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-card-border bg-sidebar-bg text-foreground focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">Date and Time (Optional)</label>
                <input
                  type="datetime-local"
                  name="paymentDate"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-card-border bg-sidebar-bg text-foreground focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">Transaction ID (Optional)</label>
                <input
                  type="text"
                  name="paymentId"
                  placeholder="e.g. TXN123456789"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-card-border bg-sidebar-bg text-foreground focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none"
                />
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

      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSendingReminder && !isSendingInvoice && setModalState({ isOpen: false, type: null })}></div>
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-xl relative z-10 p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {modalState.type === 'send' ? 'Send Invoice via Email' : 'Send Payment Reminder'}
              </h2>
              <button onClick={() => setModalState({ isOpen: false, type: null })} disabled={isSendingReminder || isSendingInvoice} className="text-zinc-400 hover:text-foreground p-1.5 rounded-md transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={modalState.type === 'send' ? executeSendInvoice : executeSendReminder} className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Recipient Email (To)</label>
                <input type="email" readOnly value={clientEmail || ''} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white opacity-70 cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">CC (Comma Separated)</label>
                  <input type="text" value={emailCc} onChange={e => setEmailCc(e.target.value)} placeholder="e.g. accounting@company.com" className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">BCC (Comma Separated)</label>
                  <input type="text" value={emailBcc} onChange={e => setEmailBcc(e.target.value)} placeholder="e.g. secret@company.com" className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Subject</label>
                <input type="text" required value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Message Body</label>
                <textarea required rows={6} value={emailMessage} onChange={e => setEmailMessage(e.target.value)} className="w-full rounded-lg px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-card-border">
                <button type="button" onClick={() => setModalState({ isOpen: false, type: null })} disabled={isSendingReminder || isSendingInvoice} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSendingReminder || isSendingInvoice} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                  <Mail size={16} />
                  {(isSendingReminder || isSendingInvoice) ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
