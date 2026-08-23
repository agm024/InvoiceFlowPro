'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
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

  const handleSendInvoice = async () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    
    if (!window.confirm(`Are you sure you want to send this invoice to ${clientEmail}?`)) return;

    setIsSending(true)
    const { sendInvoiceEmail } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendInvoiceEmail(clientEmail, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success('Invoice sent successfully!')
      if (status === 'draft') {
        await updateInvoiceStatus(invoiceId, 'sent')
      }
    } else {
      toast.error('Failed to send invoice.')
    }
    setIsSending(false)
  }

  if (!clientEmail) return null;

  return (
    <button
      onClick={handleSendInvoice}
      disabled={isSending}
      className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
    >
      <Mail size={16} /> {isSending ? 'Sending...' : 'Send via Email'}
    </button>
  )
}
