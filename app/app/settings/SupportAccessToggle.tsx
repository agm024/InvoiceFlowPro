'use client'

import { useState } from 'react'
import { toggleSupportAccess } from './support-actions'
import { Shield } from 'lucide-react'

export default function SupportAccessToggle({ initialGranted }: { initialGranted: boolean }) {
  const [granted, setGranted] = useState(initialGranted)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    setIsPending(true)
    const newValue = !granted
    await toggleSupportAccess(newValue)
    setGranted(newValue)
    setIsPending(false)
  }

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-6 shadow-sm mt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
            <Shield className="text-indigo-500 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SaaS Support Access</h3>
            <p className="text-sm text-zinc-500 mt-1">
              Allow platform administrators to securely view your dashboard to assist with troubleshooting and support requests.
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${granted ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${granted ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
    </div>
  )
}
