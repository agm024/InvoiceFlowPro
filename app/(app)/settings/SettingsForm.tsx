'use client'

import { useState } from 'react'
import { updateCompanySettings } from './actions'
import { Upload, Loader2, Save } from 'lucide-react'

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isSaving, setIsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState(initialSettings?.logoUrl || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    // Add logoUrl to formData if we have it in state (mocked image upload for now)
    if (logoPreview) {
      formData.set('logoUrl', logoPreview)
    }

    try {
      const res = await updateCompanySettings(formData)
      if (res.success) {
        // Use toast if available, otherwise alert fallback (but we added toast to layout)
        if (typeof window !== 'undefined') {
          const toast = (await import('react-hot-toast')).default
          toast.success('Settings saved successfully!')
        }
      } else {
        if (typeof window !== 'undefined') {
          const toast = (await import('react-hot-toast')).default
          toast.error('Failed to save settings')
        }
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="bg-card-bg border border-card-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-card-border">
        <h2 className="text-xl font-bold text-foreground">Company Details</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8">
        
        {/* Company Logo */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Company Logo :
          </label>
          <div className="flex-1">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-sidebar-bg border border-sidebar-border rounded-xl flex items-center justify-center overflow-hidden relative group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 font-medium text-xs">No Logo</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Upload className="text-white" size={20} />
                </div>
              </div>
              <div className="text-sm text-zinc-500">
                <p>Recommended size: 200x200px</p>
                <button type="button" onClick={() => {
                  const url = prompt('Enter logo URL (temporary mock for upload):', logoPreview)
                  if (url !== null) setLogoPreview(url)
                }} className="text-blue-500 hover:underline mt-1 font-medium">Upload new logo</button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            <span className="text-red-500">*</span>Brand Name :
          </label>
          <input 
            type="text" name="brandName" defaultValue={initialSettings?.brandName || ''} required
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Company Name */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            <span className="text-red-500">*</span>Company Name :
          </label>
          <input 
            type="text" name="companyName" defaultValue={initialSettings?.companyName || ''} required
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Company Phone */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Company Phone :
          </label>
          <div className="flex-1 flex gap-3">
            <select className="w-24 rounded-md px-3 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500">
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input 
              type="text" name="phone" defaultValue={initialSettings?.phone || ''} placeholder="Company Phone Number"
              className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Company Email */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Company Email :
          </label>
          <input 
            type="email" name="email" defaultValue={initialSettings?.email || ''} placeholder="support@company.com"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* GSTIN */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            GSTIN :
          </label>
          <div className="flex-1 flex overflow-hidden rounded-md border border-sidebar-border bg-sidebar-bg focus-within:border-blue-500 transition-colors">
            <input 
              type="text" name="gstin" defaultValue={initialSettings?.gstin || ''} placeholder="e.g. 27ABCFG1029Q1Z6"
              className="flex-1 px-4 py-2.5 bg-transparent focus:outline-none uppercase"
            />
            <button type="button" className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium border-l border-sidebar-border hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              Fetch Details
            </button>
          </div>
        </div>

        {/* LUT No */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            LUT Number (Exports) :
          </label>
          <input 
            type="text" name="lutNo" defaultValue={initialSettings?.lutNo || ''} placeholder="e.g. AD2703230..."
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* GST State Code */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            <span className="text-red-500">*</span>Home State Code :
          </label>
          <input 
            type="number" name="stateCode" defaultValue={initialSettings?.stateCode || '27'} required placeholder="e.g. 27 for MH"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Business Type */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Business Type :
          </label>
          <select 
            name="businessType" defaultValue={initialSettings?.businessType || ''}
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="">Select Type</option>
            <option value="IT & Software">IT & Software</option>
            <option value="Consulting">Consulting</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Alternative Contact Number */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Alternative Contact Number :
          </label>
          <input 
            type="text" name="altPhone" defaultValue={initialSettings?.altPhone || ''} placeholder="Alternate contact numbers"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Website */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Website :
          </label>
          <input 
            type="text" name="website" defaultValue={initialSettings?.website || ''} placeholder="www.yourcompany.com"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* PAN Number */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            PAN Number :
          </label>
          <input 
            type="text" name="panNo" defaultValue={initialSettings?.panNo || ''} placeholder="e.g. ABCFG1029Q"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors uppercase"
          />
        </div>

        {/* Default UPI ID */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-48 shrink-0">
            Default UPI ID :
          </label>
          <input 
            type="text" name="upiId" defaultValue={initialSettings?.upiId || ''} placeholder="yourname@bank"
            className="flex-1 rounded-md px-4 py-2.5 bg-sidebar-bg border border-sidebar-border focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        {/* Save Button */}
        <div className="pt-6 border-t border-card-border flex justify-end">
          <button 
            type="submit" disabled={isSaving}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Company Details
          </button>
        </div>

      </form>
    </section>
  )
}
