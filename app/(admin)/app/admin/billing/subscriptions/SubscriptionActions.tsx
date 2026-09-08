'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SubscriptionActions({ subId, status }: { subId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: 'pause' | 'resume' | 'cancel') => {
    if (!confirm(`Are you sure you want to ${action} this subscription?`)) return;
    setLoading(true)
    try {
      const res = await fetch('/api/admin/subscriptions/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subId, action })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      {status === 'active' && (
        <>
          <button onClick={() => handleAction('pause')} disabled={loading} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded font-bold hover:bg-amber-100 disabled:opacity-50">Pause</button>
          <button onClick={() => handleAction('cancel')} disabled={loading} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-100 disabled:opacity-50">Cancel</button>
        </>
      )}
      {status === 'paused' && (
        <button onClick={() => handleAction('resume')} disabled={loading} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-100 disabled:opacity-50">Resume</button>
      )}
      {status === 'cancelled' && (
        <span className="text-xs text-zinc-400 font-bold px-2 py-1">Terminated</span>
      )}
    </div>
  )
}
