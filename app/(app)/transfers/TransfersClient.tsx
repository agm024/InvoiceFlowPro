'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { createTransfer, deleteTransfer } from './actions'

type Bank = {
  id: string
  bankName: string
  accountNumber: string
}

type Transfer = {
  id: string
  date: Date
  amount: number
  reference: string | null
  notes: string | null
  fromBank: Bank
  toBank: Bank
}

export default function TransfersClient({ 
  initialTransfers, 
  banks 
}: { 
  initialTransfers: Transfer[],
  banks: Bank[]
}) {
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    if (formData.get('fromBankId') === formData.get('toBankId')) {
      toast.error('Cannot transfer to the same bank account')
      setIsSubmitting(false)
      return
    }

    const res = await createTransfer(formData)
    if (res.success) {
      toast.success('Transfer recorded successfully!')
      setShowForm(false)
      window.location.reload()
    } else {
      toast.error(res.error || 'Failed to record transfer')
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transfer record?')) {
      const res = await deleteTransfer(id)
      if (res.success) {
        setTransfers(transfers.filter(t => t.id !== id))
        toast.success('Transfer record deleted')
      }
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto w-full text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Internal Fund Transfers</h1>
          <p className="text-zinc-500">Record money moved between your own bank accounts for bookkeeping.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={18} /> {showForm ? 'Cancel' : 'Record Transfer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card-bg border border-card-border p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4">Log Internal Transfer</h2>
          {banks.length < 2 ? (
            <div className="p-4 bg-orange-50 text-orange-800 rounded-lg">
              You need at least 2 bank accounts configured in Settings to record internal transfers.
            </div>
          ) : (
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input type="number" step="0.01" name="amount" required min="1" className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-red-600 dark:text-red-400">From Bank Account</label>
                  <select name="fromBankId" required className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border">
                    {banks.map(b => (
                      <option key={b.id} value={b.id}>{b.bankName} (...{b.accountNumber.slice(-4)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-emerald-600 dark:text-emerald-400">To Bank Account</label>
                  <select name="toBankId" required className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border">
                    {banks.map(b => (
                      <option key={b.id} value={b.id}>{b.bankName} (...{b.accountNumber.slice(-4)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reference No. (Optional)</label>
                  <input type="text" name="reference" placeholder="e.g. UTR12345" className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                  <input type="text" name="notes" placeholder="e.g. Moved for payroll" className="w-full rounded-md px-4 py-2 bg-sidebar-bg border border-sidebar-border" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button disabled={isSubmitting} type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Transfer'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 dark:bg-sidebar-bg text-zinc-500 text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 border-y border-card-border">Date</th>
              <th className="px-6 py-4 border-y border-card-border">Transfer Details</th>
              <th className="px-6 py-4 border-y border-card-border">Reference</th>
              <th className="px-6 py-4 border-y border-card-border">Amount</th>
              <th className="px-6 py-4 border-y border-card-border text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-sidebar-border text-sm">
            {transfers.map(t => (
              <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-sidebar-bg/50">
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(t.date), 'dd MMM yyyy')}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-red-600 dark:text-red-400">{t.fromBank.bankName}</span>
                      <ArrowRight size={14} className="text-zinc-400" />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.toBank.bankName}</span>
                    </div>
                    {t.notes && <div className="text-xs text-zinc-500">{t.notes}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-zinc-500">{t.reference || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-foreground">₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {transfers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No internal transfers recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
