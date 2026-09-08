'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/ConfirmationModal'
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

    const handleSendInvoice = () => {
    if (!clientEmail) {
      toast.error('Client has no email address.')
      return
    }
    setShowConfirm(true)
  }

  const executeSendInvoice = async () => {
    setIsSending(true)
    const { sendInvoiceEmail } = await import('@/app/actions/email')
    const formattedAmount = '₹ ' + total.toFixed(2)
    const res = await sendInvoiceEmail(clientEmail!, clientName, invoiceNumber, invoiceId, formattedAmount)
    if (res.success) {
      toast.success(`Invoice sent successfully to ${clientEmail}!`)
      if (status === 'draft') {
        await updateInvoiceStatus(invoiceId, 'sent')
      }
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
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSendInvoice}
        title="Send Invoice Email"
        message={`Are you sure you want to send this invoice to ${clientEmail}?`}
        confirmText="Send Email"
        cancelText="Cancel"
      />
    </>
  )
}
