'use client'

import { useState } from 'react'
import { createBank, deleteBank } from './actions'
import { Plus, Trash2, Loader2, Building2 } from 'lucide-react'

export default function BankAccountsList({ initialBanks }: { initialBanks: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [banks, setBanks] = useState(initialBanks)
  const [bankRegion, setBankRegion] = useState('DOMESTIC')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    const formData = new FormData(e.currentTarget)
    const res = await createBank(formData)
    
    if (res.success) {
      alert('Bank added successfully!')
      // In a real app we'd fetch the new list or use optimistic UI
      window.location.reload()
    } else {
      alert('Failed to add bank')
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
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
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
                <label key={region} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-colors ${bankRegion === region ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-background border-sidebar-border text-zinc-600 hover:bg-sidebar-bg'}`}>
                  <input type="radio" name="bankRegion" value={region} checked={bankRegion === region} onChange={() => setBankRegion(region)} className="hidden" />
                  {region === 'DOMESTIC' ? 'India (Domestic)' : region === 'US' ? 'United States' : region === 'UK' ? 'United Kingdom' : region === 'EUROPE' ? 'Europe / SEPA' : 'Other International'}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Bank Name *</label>
            <input type="text" name="bankName" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder={bankRegion === 'US' ? "e.g. Mercury, Razorpay US" : "e.g. HDFC Bank"} />
          </div>
          {bankRegion !== 'EUROPE' && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Account Number *</label>
              <input type="text" name="accountNumber" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="A/C Number" />
            </div>
          )}
          
          {(bankRegion === 'DOMESTIC' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">IFSC Code {bankRegion === 'DOMESTIC' && '*'}</label>
              <input type="text" name="ifsc" required={bankRegion === 'DOMESTIC'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="HDFC000123" />
            </div>
          )}
          
          {(bankRegion === 'US' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">ABA Routing Number {bankRegion === 'US' && '*'}</label>
              <input type="text" name="routingNumber" required={bankRegion === 'US'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="9-digit Routing No." />
            </div>
          )}
          
          {(bankRegion === 'UK' || bankRegion === 'OTHER') && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Sort Code {bankRegion === 'UK' && '*'}</label>
              <input type="text" name="routingNumber" required={bankRegion === 'UK'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="XX-XX-XX or XXXXXX" />
            </div>
          )}
          
          {(bankRegion === 'EUROPE' || bankRegion === 'OTHER') && (
            <>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">IBAN {bankRegion === 'EUROPE' && '*'}</label>
                <input type="text" name="iban" required={bankRegion === 'EUROPE'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="DE..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">SWIFT / BIC Code {bankRegion === 'EUROPE' && '*'}</label>
                <input type="text" name="swiftCode" required={bankRegion === 'EUROPE'} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="SWIFT Code" />
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
    </div>
  )
}
