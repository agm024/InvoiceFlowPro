'use client'

import { useState } from 'react'
import { verifyPortalPassword } from './actions'
import { Lock } from 'lucide-react'

export default function PortalPasswordForm({ portalToken }: { portalToken: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await verifyPortalPassword(portalToken, password)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    }
    // If success, the server action revalidates the path, meaning the page will reload and bypass this form.
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-zinc-600 dark:text-zinc-400" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Protected Portal</h1>
        <p className="text-sm text-zinc-500 mb-8">Please enter your unique password or PIN to access this client portal.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest font-mono text-lg"
            required
            autoFocus
          />
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Portal'}
          </button>
        </form>
      </div>
    </div>
  )
}
