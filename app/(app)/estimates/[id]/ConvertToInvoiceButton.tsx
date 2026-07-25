'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { convertToInvoice } from '../actions'

export default function ConvertToInvoiceButton({ estimateId }: { estimateId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleConvert = async () => {
    if (!confirm('Are you sure you want to convert this estimate to an invoice?')) return
    
    setLoading(true)
    const res = await convertToInvoice(estimateId)
    if (res.success && res.invoiceId) {
      toast.success('Converted to Invoice successfully!')
      router.push(`/invoices/${res.invoiceId}`)
    } else {
      toast.error(res.error || 'Failed to convert to invoice')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
      Convert to Invoice
    </button>
  )
}
