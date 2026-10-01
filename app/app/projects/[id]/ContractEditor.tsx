'use client'

import { useState, useRef } from 'react'
import { FileText, Save, Check, UploadCloud, Link as LinkIcon } from 'lucide-react'
import { updateProjectContract, uploadCustomContract, markContractOfflineSigned } from '../actions'
import toast from 'react-hot-toast'

export default function ContractEditor({ projectId, initialContract, isSigned }: { projectId: string, initialContract: string | null, isSigned?: boolean }) {
  
  // Try to parse JSON, fallback to default values
  let initialVars = {
    pages: '5',
    seoTier: 'Standard',
    totalFee: '0',
    paymentRails: 'Razorpay MoneySaver / Bank Transfer / UPI',
    revisions: '2',
    assetDays: '14',
    reactivationFee: '0',
    noticeDays: '7',
    warrantyDays: '30',
    jurisdiction: 'Mumbai, Maharashtra, India',
    companyName: "[Client’s Company Name]",
    companyAddress: "[Client’s Full Physical Address]",
    primaryEmail: "[Client’s Primary Email]"
  };

  try {
    if (initialContract && initialContract.trim().startsWith('{')) {
      initialVars = { ...initialVars, ...JSON.parse(initialContract) };
    }
  } catch (e) {
    console.error("Failed to parse contract variables");
  }

  const [vars, setVars] = useState(initialVars)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB")
      return
    }
    
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      const toastId = toast.loading("Uploading custom contract...")
      const res = await uploadCustomContract(projectId, base64)
      if (res.success) {
        toast.success("Contract uploaded successfully!", { id: toastId })
      } else {
        toast.error("Failed to upload", { id: toastId })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleMarkSignedOffline = async () => {
    const confirm = window.confirm("Mark this contract as signed manually?")
    if (!confirm) return
    const toastId = toast.loading("Updating status...")
    const res = await markContractOfflineSigned(projectId, !isSigned)
    if (res.success) {
      toast.success("Status updated!", { id: toastId })
    } else {
      toast.error("Failed to update status", { id: toastId })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateProjectContract(projectId, JSON.stringify(vars))
    setIsSaving(false)
    if (res.success) {
      toast.success('Contract variables saved successfully!')
    } else {
      toast.error('Failed to update contract')
    }
  }

  const handleChange = (key: string, value: string) => {
    setVars(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm mb-8 overflow-hidden">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50">
        <h3 className="font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
          <FileText size={18} /> Contract Variables
          {isSigned && <span className="ml-2 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-md border border-green-200 dark:border-green-800">Locked (Signed)</span>}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 shadow-sm"
          >
            <UploadCloud size={16} /> Upload Custom PDF
          </button>
          <button 
            onClick={handleMarkSignedOffline}
            className={`text-sm px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 shadow-sm ${isSigned ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
          >
            <Check size={16} /> {isSigned ? 'Mark Unsigned' : 'Mark Offline Signed'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || isSigned}
            className="text-sm bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : <><Save size={16} /> Save Settings</>}
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {isSigned && (
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 z-10 rounded-b-xl flex items-center justify-center backdrop-blur-[1px]">
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Client Company Name</label>
          <input type="text" value={vars.companyName} onChange={e => handleChange('companyName', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Client Primary Email</label>
          <input type="text" value={vars.primaryEmail} onChange={e => handleChange('primaryEmail', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Client Physical Address</label>
          <input type="text" value={vars.companyAddress} onChange={e => handleChange('companyAddress', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 md:col-span-2 my-2"></div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Number of Pages</label>
          <input type="text" value={vars.pages} onChange={e => handleChange('pages', e.target.value)} placeholder="e.g. 5" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">SEO Tier</label>
          <select value={vars.seoTier} onChange={e => handleChange('seoTier', e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground">
            <option>Basic</option>
            <option>Standard</option>
            <option>Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Total Fee / Pricing</label>
          <input type="text" value={vars.totalFee} onChange={e => handleChange('totalFee', e.target.value)} placeholder="e.g. ₹50,000 or $1,000" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Payment Methods Allowed</label>
          <input type="text" value={vars.paymentRails} onChange={e => handleChange('paymentRails', e.target.value)} placeholder="e.g. Bank Transfer / UPI" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Max Revisions</label>
          <input type="text" value={vars.revisions} onChange={e => handleChange('revisions', e.target.value)} placeholder="e.g. 2" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Asset Delivery Window (Days)</label>
          <input type="text" value={vars.assetDays} onChange={e => handleChange('assetDays', e.target.value)} placeholder="e.g. 14" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ghosting Penalty Fee</label>
          <input type="text" value={vars.reactivationFee} onChange={e => handleChange('reactivationFee', e.target.value)} placeholder="e.g. ₹5,000" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Cancellation Notice (Days)</label>
          <input type="text" value={vars.noticeDays} onChange={e => handleChange('noticeDays', e.target.value)} placeholder="e.g. 7" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Warranty Period (Days)</label>
          <input type="text" value={vars.warrantyDays} onChange={e => handleChange('warrantyDays', e.target.value)} placeholder="e.g. 30" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Legal Jurisdiction</label>
          <input type="text" value={vars.jurisdiction} onChange={e => handleChange('jurisdiction', e.target.value)} placeholder="e.g. Mumbai, Maharashtra" className="w-full px-3 py-2 bg-zinc-50 dark:bg-primary border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white text-zinc-900 dark:text-primary-foreground" />
        </div>
      </div>
    </div>
  )
}
