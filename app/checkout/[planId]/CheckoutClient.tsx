"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import toast from 'react-hot-toast'
import { CheckCircle2, Lock, ChevronDown, Smartphone, CreditCard, Landmark, ShieldCheck, FileText, RotateCcw } from 'lucide-react'

// ─── Indian States ────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Lakshadweep','Puducherry',
]

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B6B67' }}>
      {children}
      {optional && <span className="ml-1.5 normal-case tracking-normal font-medium" style={{ color: '#9B9B96' }}>(Optional)</span>}
    </label>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${className}`}
      style={{
        background: '#FAFAF8',
        border: '1px solid rgba(21,21,21,0.12)',
        color: '#151515',
        ...((props as any).style),
      }}
      onFocus={e => {
        e.target.style.borderColor = '#151515'
        e.target.style.background = '#fff'
        e.target.style.boxShadow = '0 0 0 3px rgba(21,21,21,0.06)'
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(21,21,21,0.12)'
        e.target.style.background = '#FAFAF8'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none appearance-none transition-all"
        style={{ background: '#FAFAF8', border: '1px solid rgba(21,21,21,0.12)', color: '#151515' }}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 pointer-events-none" style={{ color: '#9B9B96' }} />
    </div>
  )
}

function fmt(n: number) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Success Screen ───────────────────────────────────────────────────
function SuccessScreen({ plan, total, invoiceNumber, isAnnual, onDash }: {
  plan: any; total: number; invoiceNumber: string; isAnnual: boolean; onDash: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)', boxShadow: '0 8px 40px rgba(21,21,21,0.08)' }}
      >
        {/* Check icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(32,178,107,0.12)' }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: '#20B26B' }} />
        </div>

        <h1 className="text-2xl font-black mb-2 tracking-tight" style={{ color: '#151515' }}>
          Payment successful
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6B6B67' }}>
          Your {plan.name} subscription is now active.
        </p>

        {/* Receipt */}
        <div className="rounded-xl p-5 mb-8 text-left" style={{ background: '#FAFAF8', border: '1px solid rgba(21,21,21,0.08)' }}>
          <div className="flex justify-between py-3" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}>
            <span className="text-xs font-semibold" style={{ color: '#9B9B96' }}>Invoice</span>
            <span className="text-xs font-bold font-mono" style={{ color: '#151515' }}>{invoiceNumber}</span>
          </div>
          <div className="flex justify-between py-3" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}>
            <span className="text-xs font-semibold" style={{ color: '#9B9B96' }}>Plan</span>
            <span className="text-xs font-bold" style={{ color: '#151515' }}>
              InvoiceFlowPro {plan.name} · {isAnnual ? 'Annual' : 'Monthly'}
            </span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-xs font-semibold" style={{ color: '#9B9B96' }}>Amount paid</span>
            <span className="text-base font-black font-mono" style={{ color: '#20B26B' }}>₹{fmt(total)}</span>
          </div>
        </div>

        <button
          onClick={onDash}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
          style={{ background: '#151515', color: '#fff' }}
        >
          Go to Dashboard →
        </button>
        <button
          onClick={() => window.print()}
          className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-all"
          style={{ background: 'rgba(21,21,21,0.06)', color: '#6B6B67' }}
        >
          Download Receipt
        </button>
      </div>
    </div>
  )
}

// ─── Main Checkout Client ─────────────────────────────────────────────
export default function CheckoutClient({
  plan,
  isAnnual,
  user,
  company,
}: {
  plan: any
  isAnnual: boolean
  user: any
  company: any
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const [form, setForm] = useState({
    email:       user?.email       || '',
    phone:       '',
    fullName:    user?.name        || '',
    companyName: company?.name     || '',
    address:     company?.address  || '',
    city:        company?.city     || '',
    state:       company?.state    || '',
    pincode:     '',
    country:     'India',
    gstin:       company?.gstin    || '',
  })

  const price  = isAnnual ? plan.yearlyPrice : plan.monthlyPrice
  const gst    = price * 0.18
  const total  = price + gst

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, isAnnual }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: 'InvoiceFlowPro',
        description: `${plan.name} · ${isAnnual ? 'Annual' : 'Monthly'}`,
        subscription_id: data.subscription.id,
        handler: async (response: any) => {
          toast.loading('Verifying payment…', { id: 'pay' })
          const vRes = await fetch('/api/subscriptions/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              planId: plan.id,
              isAnnual,
              companyId: user?.companyId || 'guest',
              amount: total,
              currency: 'INR',
            }),
          })
          if (vRes.ok) {
            toast.success('Payment confirmed!', { id: 'pay' })
            setInvoiceNumber(`INV-${Math.floor(10000 + Math.random() * 90000)}`)
            setSuccess(true)
          } else {
            toast.error('Verification failed. Please contact support.', { id: 'pay' })
            setLoading(false)
          }
        },
        theme: { color: '#151515' },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', (r: any) => {
        toast.error(r.error.description || 'Payment declined')
        setLoading(false)
      })
      rzp.open()
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <SuccessScreen
        plan={plan}
        total={total}
        invoiceNumber={invoiceNumber}
        isAnnual={isAnnual}
        onDash={() => router.push('/app')}
      />
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ── LEFT: Form ──────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1.5" style={{ color: '#151515' }}>
              Complete your purchase
            </h1>
            <p className="text-sm" style={{ color: '#6B6B67' }}>
              Subscribe to InvoiceFlowPro {plan.name} and start billing professionally.
            </p>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">

            {/* Contact Info */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)', background: '#FAFAF8' }}>
                <h2 className="text-sm font-bold" style={{ color: '#151515' }}>Contact information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email address</Label>
                  <Input required type="email" name="email" value={form.email} onChange={set} placeholder="you@company.com" />
                </div>
                <div>
                  <Label>Phone number</Label>
                  <Input required type="tel" name="phone" value={form.phone} onChange={set} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)', background: '#FAFAF8' }}>
                <h2 className="text-sm font-bold" style={{ color: '#151515' }}>Billing details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Full name</Label>
                  <Input required type="text" name="fullName" value={form.fullName} onChange={set} placeholder="Agastya Mishra" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Company name</Label>
                  <Input required type="text" name="companyName" value={form.companyName} onChange={set} placeholder="Apex Distribution Pvt. Ltd." />
                </div>
                <div className="sm:col-span-2">
                  <Label>Billing address</Label>
                  <Input required type="text" name="address" value={form.address} onChange={set} placeholder="123 Business Avenue" />
                </div>
                <div>
                  <Label>City</Label>
                  <Input required type="text" name="city" value={form.city} onChange={set} placeholder="Mumbai" />
                </div>
                <div>
                  <Label>State</Label>
                  <Select required name="state" value={form.state} onChange={set}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>PIN code</Label>
                  <Input required type="text" name="pincode" value={form.pincode} onChange={set} placeholder="400001" maxLength={6} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input type="text" name="country" value={form.country} readOnly
                    style={{ background: 'rgba(21,21,21,0.04)', color: '#9B9B96', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label optional>GSTIN</Label>
                  <Input type="text" name="gstin" value={form.gstin} onChange={set}
                    placeholder="27XXXXX1234X1Z5"
                    className="uppercase placeholder:normal-case"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)' }}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)', background: '#FAFAF8' }}>
                <h2 className="text-sm font-bold" style={{ color: '#151515' }}>Payment method</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {([
                    { id: 'upi',        label: 'UPI',         Icon: Smartphone  },
                    { id: 'card',       label: 'Card',        Icon: CreditCard  },
                    { id: 'netbanking', label: 'Net Banking',  Icon: Landmark    },
                  ] as const).map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl transition-all"
                      style={{
                        border: paymentMethod === m.id ? '2px solid #151515' : '1px solid rgba(21,21,21,0.12)',
                        background: paymentMethod === m.id ? 'rgba(21,21,21,0.04)' : '#FAFAF8',
                        color: paymentMethod === m.id ? '#151515' : '#9B9B96',
                      }}
                    >
                      <m.Icon size={18} />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  ))}
                </div>
                <div className="rounded-xl p-4 text-center text-xs" style={{ background: '#FAFAF8', border: '1px solid rgba(21,21,21,0.06)' }}>
                  <p className="mb-2" style={{ color: '#6B6B67' }}>
                    Your payment is processed securely by Razorpay.
                  </p>
                  <div className="flex justify-center gap-2">
                    {['PCI Compliant', '256-bit SSL', 'RBI Regulated'].map(t => (
                      <span key={t} className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)', color: '#9B9B96' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Order Summary ────────────────────────────────── */}
        <div className="lg:col-span-5">
          <div
            className="sticky top-24 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.10)', boxShadow: '0 8px 32px rgba(21,21,21,0.06)' }}
          >
            <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)', background: '#FAFAF8' }}>
              <h2 className="text-sm font-bold" style={{ color: '#151515' }}>Order summary</h2>
            </div>

            <div className="p-6">
              {/* Plan badge */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9B9B96' }}>
                    InvoiceFlowPro
                  </div>
                  <div className="text-xl font-black tracking-tight" style={{ color: '#151515' }}>{plan.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B6B67' }}>
                    {isAnnual ? 'Annual' : 'Monthly'} subscription
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-mono" style={{ color: '#151515' }}>
                    ₹{price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs" style={{ color: '#9B9B96' }}>/{isAnnual ? 'year' : 'month'}</div>
                </div>
              </div>

              {/* What's included */}
              <div className="rounded-xl p-4 mb-6 space-y-2" style={{ background: '#FAFAF8', border: '1px solid rgba(21,21,21,0.06)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9B9B96' }}>Included</div>
                {[
                  plan.userLimits === null ? 'Unlimited Users' : `Up to ${plan.userLimits} Users`,
                  plan.clientLimits === null ? 'Unlimited Clients' : `Up to ${plan.clientLimits} Clients`,
                  plan.invoiceLimits === null ? 'Unlimited Invoices' : `Up to ${plan.invoiceLimits} Invoices`,
                  plan.name.toLowerCase() === 'free' ? 'PDF with watermark' : 'PDF — No watermark',
                  'GST-ready invoicing',
                  'Multi-currency billing',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs" style={{ color: '#6B6B67' }}>
                    <span style={{ color: '#20B26B' }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm" style={{ color: '#6B6B67' }}>
                  <span>Subtotal</span>
                  <span className="font-mono">₹{fmt(price)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: '#6B6B67' }}>
                  <span>GST (18%)</span>
                  <span className="font-mono">₹{fmt(gst)}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-3" style={{ color: '#151515', borderTop: '1px solid rgba(21,21,21,0.10)' }}>
                  <span>Total</span>
                  <span className="font-mono">₹{fmt(total)}</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
                style={{
                  background: loading ? '#6B6B67' : '#151515',
                  color: '#fff',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(21,21,21,0.2)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  `Pay ₹${fmt(total)} & Subscribe`
                )}
              </button>

              <p className="text-center text-[11px] mt-3" style={{ color: '#9B9B96' }}>
                Renews at ₹{price.toLocaleString('en-IN')}/{isAnnual ? 'year' : 'month'} + GST
              </p>

              {/* Trust */}
              <div className="flex justify-center gap-4 mt-5 pt-5 text-[10px] font-semibold" style={{ borderTop: '1px solid rgba(21,21,21,0.06)', color: '#9B9B96' }}>
                <span className="flex items-center gap-1"><Lock size={11} /> Secure</span>
                <span className="flex items-center gap-1"><FileText size={11} /> GST Invoice</span>
                <span className="flex items-center gap-1"><RotateCcw size={11} /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer trust strip */}
      <div className="mt-16 pt-10" style={{ borderTop: '1px solid rgba(21,21,21,0.08)' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs" style={{ color: '#9B9B96' }}>
          {[
            { Icon: ShieldCheck, text: 'Secure payment processing via Razorpay PCI-DSS compliant vault' },
            { Icon: FileText,    text: 'GST-compliant billing with automatic B2B tax invoice generation' },
            { Icon: RotateCcw,  text: 'Easy cancellation — no hidden fees or lock-in contracts' },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5">
              <Icon size={14} className="shrink-0 mt-0.5" style={{ color: '#C0C0BC' }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 mt-8 text-[11px]" style={{ color: '#C0C0BC' }}>
          <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <a href="/refund-policy" className="hover:text-gray-600 transition-colors">Refund & Cancellation Policy</a>
        </div>
      </div>
    </>
  )
}
