"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import toast from 'react-hot-toast'
import { Check, CheckCircle2, ChevronDown, CreditCard, Landmark, Smartphone, Lock, Receipt, LifeBuoy, ShieldCheck, FileText, RotateCcw, XCircle } from 'lucide-react'

export default function CheckoutClient({ plan, isAnnual, user, company }: { plan: any, isAnnual: boolean, user: any, company: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [invoiceNumber, setInvoiceNumber] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    fullName: user?.name || '',
    companyName: company?.name || '',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    pincode: '',
    country: 'India',
    gstin: company?.gstin || ''
  })

  const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
  const gst = price * 0.18
  const total = price + gst
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulating validation & order creation
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, isAnnual })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout')
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        
        
        name: 'SiteRadiant',
        description: `${plan.name} (${isAnnual ? 'Annual' : 'Monthly'})`,
        subscription_id: data.subscription.id,
          
        
        handler: async function (response: any) {
          toast.loading('Verifying secure payment...', { id: 'payment' });
          const verifyRes = await fetch('/api/subscriptions/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              planId: plan.id,
              isAnnual,
              companyId: user?.companyId || 'guest',
              amount: total,
              currency: 'INR'
            })
          });
          
          if (verifyRes.ok) {
            toast.success('Payment successful!', { id: 'payment' });
            setInvoiceNumber(`INV-${Math.floor(10000 + Math.random() * 90000)}`)
            setSuccess(true)
          } else {
            toast.error('Payment verification failed. Contact support.', { id: 'payment' });
            setLoading(false)
          }
        },
        theme: { color: '#2563eb' }
      }
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment was declined');
        setLoading(false);
      });
      rzp.open();
      
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment successful</h1>
        <p className="text-lg text-slate-600 mb-8">Welcome to SiteRadiant! Your subscription is now active.</p>
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left border border-slate-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Invoice number</span>
            <span className="font-bold text-slate-900">{invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Plan</span>
            <span className="font-medium text-slate-900">{plan.name} ({isAnnual ? 'Annual' : 'Monthly'})</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Amount paid</span>
            <span className="font-bold text-xl text-slate-900">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.print()} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
            Download Invoice
          </button>
          <button onClick={() => router.push('/app')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">
            Go to SiteRadiant
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Complete your purchase</h1>
            <p className="text-lg text-slate-500">Start using SiteRadiant today.</p>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
            
            {/* Contact Info */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Contact information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Email address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="you@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Phone number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="+91 98765 43210" />
                </div>
              </div>
            </section>

            {/* Billing Details */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Billing details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Full name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Company name</label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Billing address</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="123 Business Avenue" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="Bengaluru" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">State</label>
                  <div className="relative">
                    <select required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white appearance-none">
                      <option value="">Select State</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">PIN code</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white" placeholder="560001" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Country</label>
                  <input required type="text" name="country" value={formData.country} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-slate-500 bg-slate-100 cursor-not-allowed" />
                </div>
                <div className="space-y-2 md:col-span-2 pt-2">
                  <label className="block text-sm font-semibold text-slate-700">GSTIN <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white uppercase placeholder:normal-case" placeholder="29XXXXX1234X1Z5" />
                </div>
              </div>
            </section>

            {/* Payment Methods (Visual Only - handled by Razorpay) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Payment method</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button type="button" onClick={() => setPaymentMethod('upi')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                    <Smartphone className="w-6 h-6 mb-2" />
                    <span className="font-semibold text-sm">UPI</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="font-semibold text-sm">Cards</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('netbanking')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'netbanking' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                    <Landmark className="w-6 h-6 mb-2" />
                    <span className="font-semibold text-sm">Net Banking</span>
                  </button>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                  <p className="text-slate-600 text-sm font-medium mb-3">You will complete your payment securely via Razorpay in the next step.</p>
                  <div className="flex justify-center gap-2">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">PCI Compliant</span>
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">256-bit Encryption</span>
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Order summary</h2>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">SiteRadiant {plan.name}</h3>
                  <p className="text-slate-500 text-sm">{isAnnual ? 'Annual subscription' : 'Monthly subscription'}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                  <p className="text-slate-500 text-sm">/ {isAnnual ? 'year' : 'month'}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-slate-100 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span className="font-medium text-slate-900">₹0.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-slate-900">₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end pt-6 border-t border-slate-200 mb-8">
                <span className="font-bold text-lg text-slate-900">Total</span>
                <span className="font-black text-3xl text-slate-900 tracking-tight">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center border border-blue-100">
                You'll be charged <span className="font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> today.
              </div>
              
              <button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} & Start Subscription`
                )}
              </button>
              
              <p className="text-center text-sm text-slate-500 mt-4 font-medium">
                Renews at ₹{price.toLocaleString('en-IN')}/{isAnnual ? 'year' : 'month'} + applicable taxes
              </p>
              
              <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure payment</span>
                <span className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> GST invoice</span>
                <span className="flex items-center gap-1.5"><LifeBuoy className="w-3.5 h-3.5" /> 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Trust Markers */}
      <footer className="mt-20 pt-10 border-t border-slate-200 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-slate-500 font-medium mb-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-400" />
            <span>Secure payment processing via Razorpay PCI-DSS compliant vault.</span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <FileText className="w-6 h-6 text-slate-400" />
            <span>GST-compliant billing with automatic B2B tax invoice generation.</span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <RotateCcw className="w-6 h-6 text-slate-400" />
            <span>Clear subscription pricing. Upgrade or downgrade anytime.</span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <XCircle className="w-6 h-6 text-slate-400" />
            <span>Easy cancellation. No hidden fees or lock-in contracts.</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Refund & Cancellation Policy</a>
        </div>
      </footer>
    </>
  )
}
