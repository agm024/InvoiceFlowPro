'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'

export default function CheckoutButton({ invoiceId, amount, currency, companyName, upiId, invoiceNumber, clientName }: { invoiceId: string, amount: number, currency: string, companyName: string, upiId?: string, invoiceNumber?: string, clientName?: string }) {
  const [loading, setLoading] = useState(false)
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
          toast.success('Payment successful!')
          router.refresh()
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
        toast.error('Payment failed: ' + response.error.description)
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
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

      {/* Dynamic Header */}
      <div className="bg-zinc-900 dark:bg-black p-8 pt-12 text-center text-white border-b border-zinc-800 -mt-8 -mx-8 mb-8">
        <h1 className="text-4xl font-black">{currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
        <p className="text-zinc-400 mt-2 font-medium tracking-wide uppercase text-sm">Payment Request</p>
      </div>

      <div className="space-y-4">
        {upiId && currency === 'INR' && (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center mb-6">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Pay with UPI</h3>
            <div className="bg-white p-3 rounded-xl shadow-sm mb-4 transition-opacity duration-200">
              <QRCodeCanvas 
                value={upiLink}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-zinc-500 text-center mb-1">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
            <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{upiId}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-4 mt-2">
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {upiId ? 'OR PAY VIA CARD / NETBANKING' : 'PAY SECURELY'}
          </span>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
        </div>

        <button 
          onClick={handlePayment} 
          disabled={loading}
          className="w-full bg-zinc-900 hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
          Pay {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </button>
      </div>
    </>
  )
}
