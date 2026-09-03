'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Building, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { completeGoogleOnboardingAction } from './actions'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // Actually step 2 from sign-up
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    country: 'India',
    gstin: '',
    pan: '',
    address: '',
    city: '',
    state: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.companyName) return toast.error('Company Name is required')
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await completeGoogleOnboardingAction(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      } else {
        window.location.href = '/app'
      }
    } catch (e: any) {
      toast.error('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-8">
          <div className="w-10 h-10 mx-auto bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center shadow-sm mb-6">
            <span className="text-white dark:text-zinc-900 font-bold text-xl">I</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Complete your profile</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Tell us about your business to get started</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-xl overflow-hidden">
          
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10">
              <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((step - 1) / 1) * 100}%` }} />
            </div>
            {[1, 2].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-blue-600 text-white border-2 border-blue-600' : 'bg-white dark:bg-zinc-900 text-zinc-400 border-2 border-zinc-200 dark:border-zinc-700'}`}>
                {i}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6 text-zinc-800 dark:text-zinc-200">
                  <Building size={20} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Business Profile</h2>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Acme Corp" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Business Type</label>
                  <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option value="">Select Type</option>
                    <option value="Freelance / Individual">Freelance / Individual</option>
                    <option value="LLC">LLC</option>
                    <option value="Private Limited">Private Limited</option>
                    <option value="Partnership">Partnership</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Retail">Retail</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={nextStep} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6 text-zinc-800 dark:text-zinc-200">
                  <FileText size={20} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Tax & Address (Optional)</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GSTIN</label>
                    <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">PAN</label>
                    <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="e.g. ABCDE1234F" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Business St" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={prevStep} className="px-4 py-3 rounded-xl font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Complete Setup <CheckCircle2 size={18} /></>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
