'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { QRCodeSVG } from 'qrcode.react'

export default function CheckoutButton({ invoiceId, amount, currency, companyName, upiId, invoiceNumber, clientName }: { invoiceId: string, amount: number, currency: string, companyName: string, upiId?: string, invoiceNumber?: string, clientName?: string }) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay'>(upiId ? 'upi' : 'razorpay')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailed, setIsFailed] = useState(false)
  const [failureReason, setFailureReason] = useState('')
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, amount })
      })
      const order = await res.json()

      if (order.error) {
        toast.error(order.error)
        setLoading(false)
        return
      }

      if (order.mock) {
        toast.success('Mock payment successful! (No Razorpay Keys)')
        await fetch('/api/razorpay/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order.paid',
            payload: { payment: { entity: { order_id: order.id, id: 'pay_mock123', amount: order.amount } } }
          })
        })
        setLoading(false)
        router.refresh()
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: companyName,
        description: `Payment for Invoice`,
        order_id: order.id,
        handler: async function (response: any) {
          setLoading(true)
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                invoiceId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })
            
            if (verifyRes.ok) {
              setIsSuccess(true)
              import('canvas-confetti').then((confetti) => {
                confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
              })
              setTimeout(() => {
                router.refresh()
              }, 3000)
            } else {
              toast.error('Payment verification failed.')
              setIsFailed(true)
              setFailureReason('We received your payment but could not verify the signature. Please contact support.')
            }
          } catch (e) {
            toast.error('Verification error')
          }
          setLoading(false)
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#09090b' 
        }
      }

      const rzp1 = new (window as any).Razorpay(options)
      rzp1.on('payment.failed', function (response: any) {
        setIsFailed(true)
        setFailureReason(response.error.description || 'Your payment was declined by the bank or cancelled.')
        toast.error('Payment failed')
      })
      rzp1.open()
      
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  const upiLink = upiId ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(companyName)}&am=${amount.toFixed(2)}&cu=INR` : ''

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Dynamic Header */}
      {!isSuccess && !isFailed && (
        <div className="bg-zinc-900 dark:bg-black p-8 pt-12 text-center text-white border-b border-zinc-800 -mt-8 -mx-8 mb-8">
          <h1 className="text-4xl font-black">{currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          <p className="text-zinc-400 mt-2 font-medium tracking-wide uppercase text-sm">Payment Request</p>
        </div>
      )}

      {isSuccess && (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500 fade-in">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={56} className="text-green-500 drop-shadow-md animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_1]" />
            <CheckCircle2 size={56} className="text-green-500 absolute drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">Your invoice has been automatically marked as paid. We are redirecting you...</p>
        </div>
      )}

      {isFailed && (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Payment Failed</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6">{failureReason}</p>
          <button 
            onClick={() => { setIsFailed(false); setLoading(false) }} 
            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {!isSuccess && !isFailed && (
        <div className="space-y-6">
        {/* Payment Method Selector */}
        {upiId && currency === 'INR' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                paymentMethod === 'upi' 
                  ? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800' 
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 opacity-70'
              }`}
            >
              <h3 className="font-bold text-zinc-900 dark:text-white">UPI / Apps</h3>
              <p className="text-xs text-zinc-500 mt-1">GPay, PhonePe, Paytm</p>
            </button>
            <button
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-4 rounded-2xl border text-center transition-all ${
                paymentMethod === 'razorpay' 
                  ? 'border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-800' 
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 opacity-70'
              }`}
            >
              <h3 className="font-bold text-zinc-900 dark:text-white">Cards / Netbanking</h3>
              <p className="text-xs text-zinc-500 mt-1">Powered by Razorpay</p>
            </button>
          </div>
        )}

        {/* Selected Payment Method View */}
        {paymentMethod === 'upi' && upiId && currency === 'INR' ? (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
              <QRCodeSVG 
                value={upiLink}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white mt-2">Scan with any UPI App</p>
            <p className="text-sm font-bold text-zinc-500 mt-1 tracking-wide">{upiId}</p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-zinc-900/20"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
              Pay Securely via Razorpay
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <span>Supports Credit/Debit Cards, Netbanking & Wallets</span>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  )
}
