'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Building, User, FileText, Eye, EyeOff, Mail } from 'lucide-react'
import { signUpAction, signUpWithGoogleAction } from './actions'
import { sendOtpAction, verifyOtpAction } from './otp-actions'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otp, setOtp] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const handleSendOtp = async () => {
    if (!formData.name || !formData.email || !formData.password) return toast.error('Please fill all fields')
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match')
    if (formData.password.length < 8) return toast.error('Password must be at least 8 characters')
    
    setLoading(true)
    const res = await sendOtpAction(formData.email, formData.name)
    setLoading(false)
    
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Verification code sent!')
      setStep(2)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return toast.error('Please enter a 6-digit code')
    
    setLoading(true)
    const res = await verifyOtpAction(formData.email, otp)
    setLoading(false)
    
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Email verified!')
      setStep(3)
    }
  }

  const nextStep = () => {
    if (step === 3) {
      if (!formData.companyName) return toast.error('Company Name is required')
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await signUpAction(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      }
    } catch (e: any) {
      // next-auth redirects
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white dark:text-zinc-900 font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">InvoiceFlow<span className="text-blue-600">Pro</span></span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Join thousands of businesses managing invoices</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-xl overflow-hidden">
          
          {/* Progress */}
          {step < 5 && (
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
              </div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-blue-600 text-white border-2 border-blue-600' : 'bg-white dark:bg-zinc-900 text-zinc-400 border-2 border-zinc-200 dark:border-zinc-700'}`}>
                  {i}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6 text-zinc-800 dark:text-zinc-200">
                  <User size={20} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Account Details</h2>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Work Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                    <input type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-zinc-500">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm</label>
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-9 text-zinc-500">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleSendOtp} disabled={loading} className="w-full mt-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify Email <ArrowRight size={18} /></>}
                </button>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                <form action={signUpWithGoogleAction} className="mt-4">
                  <button type="submit" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Sign up with Google (Skip verification)
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6 text-zinc-800 dark:text-zinc-200">
                  <Mail size={20} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Verify Email</h2>
                </div>
                <p className="text-sm text-zinc-500 mb-4">We've sent a 6-digit verification code to <strong>{formData.email}</strong>. Please enter it below.</p>
                <div className="space-y-1.5">
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="w-full text-center tracking-[0.5em] text-2xl px-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={prevStep} className="px-4 py-3 rounded-xl font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <button onClick={handleVerifyOtp} disabled={loading} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify Code <CheckCircle2 size={18} /></>}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
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
                  <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <button onClick={nextStep} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
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

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account? <Link href="/sign-in" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
