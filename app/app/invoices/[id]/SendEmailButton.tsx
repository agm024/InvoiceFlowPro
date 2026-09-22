'use client'

import { useState } from 'react'
import { Mail, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateInvoiceStatus } from './actions'

interface Props {
  invoiceId: string;
  invoiceNumber: string;
  total: number;
  status: string;
  clientName: string;
  clientEmail: string | null;
}

export default function SendEmailButton({ invoiceId, invoiceNumber, total, status, clientName, clientEmail }: Props) {
  const [isSending, setIsSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailCc, setEmailCc] = useState('')
  const [emailBcc, setEmailBcc] = useState('')

  const handleSendInvoice = () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setEmailSubject(`Invoice Available: ${invoiceNumber}`)
    setEmailMessage('A new invoice has been generated for you and is now available for review and payment.')
    setEmailCc('')
    setEmailBcc('')
    setShowConfirm(true)
  }

  const executeSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
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
      setShowConfirm(false)
    } else {
      toast.error('Something went wrong. Try again.')
    }
    setIsSending(false)
  }

  if (!clientEmail) return null;

  return (
    <>
    <button
      onClick={handleSendInvoice}
      disabled={isSending}
      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
    >
      <Mail size={16} /> {isSending ? 'Sending...' : 'Send via Email'}
    </button>
      
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSending && setShowConfirm(false)}></div>
          <div className="bg-card-bg border border-card-border rounded-2xl shadow-2xl w-full max-w-xl relative z-10 p-6 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Send Invoice via Email</h2>
              <button onClick={() => setShowConfirm(false)} disabled={isSending} className="text-zinc-400 hover:text-foreground p-1.5 rounded-md transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={executeSendInvoice} className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">
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
                <button type="button" onClick={() => setShowConfirm(false)} disabled={isSending} className="px-5 py-2.5 font-medium text-zinc-500 hover:bg-sidebar-bg rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSending} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                  <Mail size={16} />
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
