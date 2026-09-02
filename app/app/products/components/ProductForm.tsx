'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CustomDropdown from '@/components/CustomDropdown'
import { ArrowLeft, Save, IndianRupee, Percent, Package, Tag, FileText } from 'lucide-react'

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
  const [gstRate, setGstRate] = useState(initialData?.gstRate?.toString() || "18")
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)

  async function processSubmit(formData: FormData, updateDrafts: boolean) {
    setLoading(true)
    setError(null)
    setShowConfirmModal(false)
    
    formData.set('taxInclusive', taxInclusive)
    formData.set('gstRate', gstRate)
    if (updateDrafts) {
      formData.set('updateDrafts', 'true')
    }
    
    const res = await action(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/app/products')
      router.refresh()
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Check if price or name changed and this is an edit (initialData exists)
    if (initialData) {
      const newPrice = formData.get('price')?.toString()
      const newName = formData.get('name')?.toString()
      const oldPrice = initialData.price?.toString()
      const oldName = initialData.name?.toString()
      
      if (newPrice !== oldPrice || newName !== oldName) {
        setPendingFormData(formData)
        setShowConfirmModal(true)
        return
      }
    }
    
    processSubmit(formData, false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/app/products" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors mb-4 group">
          <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Package size={24} />
          </div>
          {title}
        </h1>
      </div>
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Update Existing Drafts?</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              You've changed the price or name of this product. Would you like to automatically apply these changes to any active Draft or Estimate that uses this product? <br/><br/>
              <span className="font-semibold text-zinc-800 dark:text-zinc-300">Issued and Paid invoices will NOT be affected</span> to protect your accounting history.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button 
                onClick={() => processSubmit(pendingFormData!, false)} 
                className="px-5 py-2.5 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                No, just save product
              </button>
              <button 
                onClick={() => processSubmit(pendingFormData!, true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
              >
                Yes, update drafts
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-zinc-200 dark:divide-zinc-800">
          
          {error && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full shrink-0">!</span>
              {error}
            </div>
          )}

          {/* Basic Details Section */}
          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                Basic Details
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                      Service / Product Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="name" 
                      defaultValue={initialData?.name}
                      required 
                      className="w-full rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      placeholder="e.g. Website Design, Consulting Hours" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                      Category <span className="text-xs font-medium text-zinc-500">(Optional)</span>
                    </label>
                    <input 
                      name="category" 
                      defaultValue={initialData?.category || ''}
                      className="w-full rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                      placeholder="e.g. Website Packages, Marketing" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-zinc-50 dark:bg-zinc-900/50">
                      <span className="flex items-center justify-center px-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-500">
                        <IndianRupee size={16} />
                      </span>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        defaultValue={initialData?.price}
                        required 
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 font-medium" 
                      />
                      <CustomDropdown
                        value={taxInclusive}
                        onChange={setTaxInclusive}
                        options={[
                          { value: "false", label: "Excl. Tax" },
                          { value: "true", label: "Incl. Tax" }
                        ]}
                        className="border-l border-zinc-200 dark:border-zinc-800"
                        buttonClassName="h-full px-3 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-transparent flex items-center gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                      GST Rate (%) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CustomDropdown
                        value={gstRate}
                        onChange={setGstRate}
                        options={[
                          { value: "0", label: "0% GST" },
                          { value: "5", label: "5% GST" },
                          { value: "12", label: "12% GST" },
                          { value: "18", label: "18% GST (Standard)" },
                          { value: "28", label: "28% GST" }
                        ]}
                        className="w-full"
                        buttonClassName="w-full rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold cursor-pointer text-zinc-700 dark:text-zinc-200 flex items-center justify-between"
                      />
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <Percent size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                    Primary Unit
                  </label>
                  <input 
                    name="unit" 
                    defaultValue={initialData?.unit || ''}
                    className="w-full md:w-1/2 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" 
                    placeholder="e.g. Hrs, Pcs, Months" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Section */}
          <div className="p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-900/10">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              Advanced <span className="text-xs font-medium text-zinc-500">(Optional)</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                  HSN / SAC Code
                </label>
                <div className="relative">
                  <input 
                    name="hsn" 
                    defaultValue={initialData?.hsn || ''}
                    className="w-full rounded-xl px-4 py-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium pl-10" 
                    placeholder="e.g. 9983"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <Tag size={16} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 mb-2">
                  Purchase Price
                </label>
                <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-white dark:bg-zinc-900/50">
                  <span className="flex items-center justify-center px-4 border-r border-zinc-200 dark:border-zinc-800 text-zinc-500">
                    <IndianRupee size={16} />
                  </span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="purchasePrice" 
                    defaultValue={initialData?.purchasePrice || '0'}
                    className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 font-medium" 
                  />
                </div>
              </div>
            </div>
          </div>

          <input type="hidden" name="description" value={initialData?.description || ''} />

          {/* Footer Actions */}
          <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-zinc-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
