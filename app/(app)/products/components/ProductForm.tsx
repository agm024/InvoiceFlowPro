'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ProductFormProps = {
  initialData?: any
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  title: string
}

export default function ProductForm({ initialData, action, title }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [taxInclusive, setTaxInclusive] = useState(initialData?.taxInclusive ? 'true' : 'false')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.set('taxInclusive', taxInclusive)
    
    const res = await action(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/products')
      router.refresh()
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/products" className="text-sm text-zinc-500 hover:text-foreground mb-4 inline-block">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8 text-foreground">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Row 1: Service Name */}
          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
              <span className="text-red-500">*</span>Service Name
            </label>
            <input 
              name="name" 
              defaultValue={initialData?.name}
              required 
              className="w-full rounded-md px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" 
              placeholder="e.g. Website Design" 
            />
          </div>

          {/* Row 2: Selling Price & Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                Selling Price
              </label>
              <div className="flex">
                <span className="flex items-center justify-center px-4 border border-r-0 border-sidebar-border bg-sidebar-bg rounded-l-md text-zinc-500 font-medium">₹</span>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price" 
                  defaultValue={initialData?.price}
                  required 
                  className="w-full px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" 
                />
                <select 
                  value={taxInclusive}
                  onChange={(e) => setTaxInclusive(e.target.value)}
                  className="border border-l-0 border-sidebar-border bg-background rounded-r-md px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-zinc-600"
                >
                  <option value="false">without Tax</option>
                  <option value="true">with Tax</option>
                </select>
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                {taxInclusive === 'false' ? 'Exclusive of Taxes' : 'Inclusive of Taxes'}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                <span className="text-red-500">*</span>Tax %
              </label>
              <div className="flex relative items-center">
                <select 
                  name="gstRate" 
                  defaultValue={initialData?.gstRate?.toString() || "18"} 
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="28">28</option>
                </select>
                <div className="absolute right-3 pointer-events-none text-zinc-400 text-sm flex items-center gap-2">
                  <span className="hidden md:inline">(9% CGST & 9% SGST, 18% IGST)</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Primary Unit */}
          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
              Primary Unit
            </label>
            <input 
              name="unit" 
              defaultValue={initialData?.unit || ''}
              className="w-full md:w-1/2 rounded-md px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" 
              placeholder="" 
            />
          </div>
          
          <div className="pt-6 mt-6 border-t border-sidebar-border">
            <h3 className="font-semibold text-sm mb-6 text-zinc-500 uppercase tracking-wider">Additional Information <span className="font-normal">(OPTIONAL)</span></h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                  HSN/SAC
                </label>
                <input 
                  name="hsn" 
                  defaultValue={initialData?.hsn || ''}
                  className="w-full rounded-md px-4 py-2.5 bg-background border border-sidebar-border focus:outline-none focus:border-blue-500" 
                />
                <a href="#" className="text-blue-500 text-xs mt-2 inline-block hover:underline">Click here to check GST approved HSN/SAC codes.</a>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                  Purchase Price
                </label>
                <div className="flex">
                  <input 
                    type="number" 
                    step="0.01" 
                    name="purchasePrice" 
                    defaultValue={initialData?.purchasePrice || '0'}
                    className="w-full px-4 py-2.5 bg-background border border-r-0 border-sidebar-border rounded-l-md focus:outline-none focus:border-blue-500" 
                  />
                  <div className="border border-sidebar-border bg-sidebar-bg rounded-r-md px-4 py-2.5 text-sm flex items-center text-zinc-500">
                    with Tax
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input type="hidden" name="description" value={initialData?.description || ''} />

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
