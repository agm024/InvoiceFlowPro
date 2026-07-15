'use client'

import { useState } from 'react'
import { createExchangeRate, deleteExchangeRate } from './actions'
import { Plus, Trash2, Loader2, DollarSign } from 'lucide-react'

export default function ExchangeRatesList({ initialRates }: { initialRates: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [rates, setRates] = useState(initialRates)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsAdding(true)
    const formData = new FormData(e.currentTarget)
    const res = await createExchangeRate(formData)
    
    if (res.success) {
      window.location.reload()
    } else {
      alert('Failed to save exchange rate')
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this rate?')) {
      const res = await deleteExchangeRate(id)
      if (res.success) {
        setRates(rates.filter(r => r.id !== id))
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {rates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {rates.map(rate => (
            <div key={rate.id} className="p-4 rounded-xl border border-card-border bg-sidebar-bg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground uppercase">{rate.currency}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5 font-medium">1 {rate.currency} = ₹{rate.rate}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(rate.id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-sidebar-bg/50 border border-dashed border-card-border rounded-xl text-zinc-500">
          No exchange rates added yet.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-sidebar-bg border border-card-border rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Currency Code *</label>
          <input type="text" name="currency" required maxLength={3} className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500 uppercase" placeholder="e.g. USD, EUR" />
        </div>
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Exchange Rate (in INR) *</label>
          <input type="number" step="0.01" name="rate" required className="w-full rounded-lg px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" placeholder="e.g. 83.50" />
        </div>
        <button 
          type="submit" disabled={isAdding}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 w-full md:w-auto h-[42px]"
        >
          {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Save Rate
        </button>
      </form>
    </div>
  )
}
