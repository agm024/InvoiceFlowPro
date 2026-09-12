'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CreditCard, CheckCircle2 } from 'lucide-react'

export default function PaymentGatewaysClient({ settings }: { settings: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isConnected = !!settings?.razorpayAccountId

  const handleConnect = () => {
    setLoading(true)
    // Redirect to our internal API route which will redirect to Razorpay
    window.location.href = '/api/payments/razorpay/connect'
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Razorpay? Customers will no longer be able to pay via this gateway.')) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/payments/razorpay/disconnect', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to disconnect')
      toast.success('Razorpay disconnected successfully')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Payment Gateways</h2>
        <p className="text-sm text-zinc-500 mt-1">Connect payment gateways to allow clients to pay invoices online.</p>
      </div>

      <section className="bg-card-bg border border-card-border rounded-xl p-6 md:p-8 shadow-sm max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                Razorpay
                {isConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                )}
              </h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-md">
                Accept payments via UPI, Credit/Debit Cards, NetBanking, and Wallets directly into your Razorpay account.
              </p>
              {isConnected && settings.razorpayAccountId && (
                <p className="text-xs text-zinc-400 mt-2 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">
                  Account ID: {settings.razorpayAccountId}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                Connect Razorpay
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
