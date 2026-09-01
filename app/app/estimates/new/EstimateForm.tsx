'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { createEstimate } from '../actions'

type Client = { id: string, name: string, currency?: string }
type Product = { id: string, name: string, price: number, gstRate: number, description?: string | null }
type Settings = any

export default function EstimateForm({ 
  clients, 
  products, 
  settings, 
  nextEstimateNumber 
}: { 
  clients: Client[], 
  products: Product[], 
  settings: Settings, 
  nextEstimateNumber: string 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const baseCurrency = settings?.baseCurrency || 'INR'

  const [formData, setFormData] = useState({
    clientId: '',
    estimateNumber: nextEstimateNumber || 'EST-001',
    date: new Date().toISOString().split('T')[0],
    currency: baseCurrency,
    exchangeRate: 1,
    status: 'sent',
    notes: 'Thank you for your interest.',
    
  })

  const [items, setItems] = useState<any[]>([{ 
    id: crypto.randomUUID(), productId: '', description: '', quantity: 1, rate: 0, taxRate: 0, taxAmount: 0, total: 0 
  }])

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    setFormData(prev => ({ 
      ...prev, 
      clientId, 
      currency: client?.currency || prev.currency 
    }))
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item
      
      const updated = { ...item, [field]: value }
      
      if (field === 'productId') {
        const product = products.find(p => p.id === value)
        if (product) {
          updated.description = product.description || ''
          updated.rate = product.price
          updated.taxRate = product.gstRate
        }
      }
      
      const q = parseFloat(updated.quantity) || 0
      const r = parseFloat(updated.rate) || 0
      const t = parseFloat(updated.taxRate) || 0
      
      const amount = q * r
      updated.taxAmount = (amount * t) / 100
      updated.total = amount + updated.taxAmount
      
      return updated
    }))
  }

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), productId: '', description: '', quantity: 1, rate: 0, taxRate: 0, taxAmount: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const subTotal = items.reduce((acc, item) => acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)), 0)
  const taxTotal = items.reduce((acc, item) => acc + (parseFloat(item.taxAmount) || 0), 0)
  const total = subTotal + taxTotal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId) {
      toast.error('Please select a client')
      return
    }
    
    if (items.some(i => !i.productId)) {
      toast.error('Please select a product for all items')
      return
    }

    setLoading(true)
    
    const payload = {
      ...formData,
      subTotal,
      taxTotal,
      total,
      items: items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        taxRate: parseFloat(item.taxRate),
        taxAmount: parseFloat(item.taxAmount),
        total: parseFloat(item.total)
      }))
    }

    const res = await createEstimate(payload)
    
    if (res?.error) {
      toast.error(res.error)
      setLoading(false)
    } else {
      toast.success('Estimate created successfully!')
      router.push('/app/estimates')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create Estimate</h1>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Estimate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Client</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  value={formData.clientId}
                  onChange={e => handleClientChange(e.target.value)}
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estimate Date</label>
                <input 
                  type="date"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Currency</label>
                <div className="flex gap-2">
                  <select 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Items</h3>
              <div className="divide-y border-b border-zinc-100 dark:border-zinc-800 divide-zinc-100 dark:divide-zinc-800">
                {items.map((item, index) => (
                  <div key={item.id} className="group py-4 md:py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 relative border border-zinc-200 dark:border-zinc-800 md:border-none p-3 md:p-0 rounded-lg md:rounded-none mb-3 md:mb-0">
                    
                    <button type="button" onClick={() => removeItem(item.id)} className="absolute top-3 right-3 md:hidden text-zinc-400 opacity-60 hover:opacity-100 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>

                    <div className="flex-1 md:pr-4">
                      <div className="relative">
                        <select 
                          className="w-[90%] md:w-full bg-transparent font-semibold md:font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:-ml-2 md:px-2 md:py-1 transition-colors appearance-none !bg-none"
                          value={item.productId}
                          onChange={e => handleItemChange(item.id, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Select Product...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-2 flex items-center px-2 text-zinc-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      <input 
                        type="text"
                        placeholder="Description (optional)"
                        className="w-[90%] md:w-full mt-1 bg-transparent border-none text-xs text-zinc-500 focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:-ml-2 md:px-2 py-0.5 transition-colors"
                        value={item.description || ""}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center text-sm md:text-base text-zinc-500 md:text-zinc-900 dark:md:text-zinc-100 md:contents">
                      <div className="flex items-center md:w-24">
                        <input 
                          type="number" min="0.01" step="0.01" value={item.quantity || ""} 
                          onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="w-10 md:w-full bg-transparent md:text-center font-medium focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:px-2 md:py-1"
                          placeholder="Qty"
                          required
                        />
                      </div>
                      <span className="mx-1 md:hidden">×</span>
                      <div className="flex items-center md:w-32">
                        <span className="md:hidden mr-1">{formData.currency}</span>
                        <input 
                          type="number" min="0" step="0.01" value={item.rate || ""} 
                          onChange={e => handleItemChange(item.id, 'rate', e.target.value)}
                          className="w-20 md:w-full bg-transparent md:text-right font-medium focus:outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded md:px-2 md:py-1"
                          placeholder="Rate"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-1 md:mt-0 md:contents">
                      <div className="text-sm md:text-base font-bold md:font-medium text-zinc-900 dark:text-zinc-100 md:w-32 md:text-right">
                        <span className="md:hidden">{formData.currency} </span>{item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    
                    <div className="hidden md:flex w-10 justify-end">
                      <button type="button" onClick={() => removeItem(item.id)} className="text-zinc-400 opacity-40 hover:opacity-100 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={addItem}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white hover:underline transition-colors"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Summary</h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Estimate #</label>
              <input 
                type="text"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                value={formData.estimateNumber}
                onChange={e => setFormData({ ...formData, estimateNumber: e.target.value })}
                required
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Subtotal</span>
                <span>{formData.currency} {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Tax</span>
                <span>{formData.currency} {taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total</span>
                <span>{formData.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Additional Info</h3>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
              <textarea 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white h-20 resize-none"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
