'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { createBank, deleteBank, createInternalTransfer, deleteInternalTransfer } from './actions'
import { Plus, Trash2, Loader2, Building2, ArrowRightLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function BankAccountsList({ initialBanks, initialTransfers = [] }: { initialBanks: any[], initialTransfers?: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [banks, setBanks] = useState(initialBanks)
  const [transfers, setTransfers] = useState(initialTransfers)
  const [bankRegion, setBankRegion] = useState('DOMESTIC')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    const formData = new FormData(e.currentTarget)
    const res = await createBank(formData)
    
    if (res.success) {
      toast.success('Bank added successfully!')
      // In a real app we'd fetch the new list or use optimistic UI
      window.location.reload()
    } else {
      toast.error('Failed to add bank')
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this bank account?')) {
      const res = await deleteBank(id)
      if (res.success) {
        setBanks(banks.filter(b => b.id !== id))
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {banks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {banks.map(bank => (
            <div key={bank.id} className="p-4 rounded-xl border border-card-border bg-sidebar-bg flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 dark:bg-zinc-800/30 flex items-center justify-center text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{bank.bankName}</h3>
                  {bank.accountNumber !== bank.iban && (
                    <p className="text-sm text-zinc-500 mt-1 tracking-wider">{bank.accountNumber}</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {bank.ifsc && <span>IFSC: {bank.ifsc}</span>}
                    {bank.swiftCode && <span> SWIFT: {bank.swiftCode}</span>}
                    {bank.routingNumber && <span> Routing: {bank.routingNumber}</span>}
                    {bank.iban && <span> IBAN: {bank.iban}</span>}
                  </p>
                  <div className="mt-3 inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-md border border-green-200 dark:border-green-800/50">
                    Balance: ₹{(bank.currentBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(bank.id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-sidebar-bg/50 border border-dashed border-card-border rounded-xl text-zinc-500">
          No bank accounts added yet.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-sidebar-bg border border-card-border rounded-xl space-y-4">
        <h3 className="font-medium text-foreground mb-2">Add New Bank Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 mb-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Bank Region / Type</label>
            <div className="flex flex-wrap gap-3">
              {['DOMESTIC', 'US', 'UK', 'EUROPE', 'OTHER'].map(region => (
                <label key={region} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${bankRegion === region ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white' : 'bg-background border-sidebar-border text-zinc-600 hover:bg-sidebar-bg'}`}>
                  <input type="radio" name="bankRegion" value={region} checked={bankRegion === region} onChange={() => setBankRegion(region)} className="hidden" />
                  {region === 'DOMESTIC' ? 'India (Domestic)' : region === 'US' ? 'United States' : region === 'UK' ? 'United Kingdom' : region === 'EUROPE' ? 'Europe / SEPA' : 'Other International'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Bank Name *</label>
            <input type="text" name="bankName" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder={bankRegion === 'US' ? "e.g. Mercury, Razorpay US" : "e.g. HDFC Bank"} />
          </div>
          {bankRegion !== 'EUROPE' && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Account Number *</label>
              <input type="text" name="accountNumber" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="A/C Number" />
            </div>
          )}
          
          {(bankRegion === 'DOMESTIC' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">IFSC Code {bankRegion === 'DOMESTIC' && '*'}</label>
              <input type="text" name="ifsc" required={bankRegion === 'DOMESTIC'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="HDFC000123" />
            </div>
          )}
          
          {(bankRegion === 'US' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">ABA Routing Number {bankRegion === 'US' && '*'}</label>
              <input type="text" name="routingNumber" required={bankRegion === 'US'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="9-digit Routing No." />
            </div>
          )}
          
          {(bankRegion === 'UK' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Sort Code {bankRegion === 'UK' && '*'}</label>
              <input type="text" name="routingNumber" required={bankRegion === 'UK'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="XX-XX-XX or XXXXXX" />
            </div>
          )}
          
          {(bankRegion === 'EUROPE' || bankRegion === 'OTHER') && (
            <>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">IBAN {bankRegion === 'EUROPE' && '*'}</label>
                <input type="text" name="iban" required={bankRegion === 'EUROPE'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="DE..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">SWIFT / BIC Code {bankRegion === 'EUROPE' && '*'}</label>
                <input type="text" name="swiftCode" required={bankRegion === 'EUROPE'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-zinc-900 dark:border-white" placeholder="SWIFT Code" />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end pt-2">
          <button 
            type="submit" disabled={isAdding}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add Bank
          </button>
        </div>
      </form>

      {/* Internal Transfers Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-foreground mb-1">Internal Fund Transfers</h2>
        <p className="text-sm text-zinc-500 mb-6">Record keeping for moving funds between your accounts (not taxable).</p>
        
        <form 
          onSubmit={async (e) => {
            e.preventDefault()
            setIsTransferring(true)
            const res = await createInternalTransfer(new FormData(e.currentTarget))
            if (res.success) {
              toast.success('Transfer logged successfully')
              window.location.reload()
            } else {
              toast.error(res.error || 'Transfer failed')
              setIsTransferring(false)
            }
          }}
          className="p-6 bg-sidebar-bg border border-card-border rounded-xl space-y-4 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">From Bank</label>
              <select name="fromBankId" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border">
                <option value="">Select source...</option>
                {banks.map(b => <option key={b.id} value={b.id}>{b.bankName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">To Bank</label>
              <select name="toBankId" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border">
                <option value="">Select destination...</option>
                {banks.map(b => <option key={b.id} value={b.id}>{b.bankName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Amount</label>
              <input type="number" step="0.01" name="amount" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border" placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Date</label>
              <input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border" />
            </div>
            <div>
              <button disabled={isTransferring} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2">
                <ArrowRightLeft size={16} /> Transfer
              </button>
            </div>
          </div>
        </form>

        <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-sidebar-bg text-zinc-500 text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-y border-card-border">Date</th>
                <th className="px-6 py-4 border-y border-card-border">From</th>
                <th className="px-6 py-4 border-y border-card-border">To</th>
                <th className="px-6 py-4 border-y border-card-border">Amount</th>
                <th className="px-6 py-4 border-y border-card-border text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-sidebar-border text-sm">
              {transfers.map(tr => (
                <tr key={tr.id} className="hover:bg-zinc-50/50 dark:hover:bg-sidebar-bg/50">
                  <td className="px-6 py-4 whitespace-nowrap">{format(new Date(tr.date), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600 dark:text-red-400">{tr.fromBank.bankName}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">{tr.toBank.bankName}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">₹{tr.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={async () => {
                        if(confirm('Delete this transfer record?')) {
                          const res = await deleteInternalTransfer(tr.id)
                          if (res.success) setTransfers(transfers.filter(t => t.id !== tr.id))
                        }
                      }} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No internal transfers recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
