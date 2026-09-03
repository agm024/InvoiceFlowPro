const fs = require('fs');
const content = `'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react'
import { acceptInvitationAction, checkInvitationAction } from './actions'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invitation token.')
      setLoading(false)
      return
    }

    checkInvitationAction(token).then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setEmail(res.email!)
      }
      setLoading(false)
    })
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || password.length < 8) {
      setError('Name is required and password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const res = await acceptInvitationAction(token!, name, password)
      if (res.error) {
        setError(res.error)
        setSubmitting(false)
      }
      // If success, acceptInvitationAction will redirect us.
    } catch (err: any) {
      if (err.message !== 'NEXT_REDIRECT') {
        setError('Something went wrong. Please try again.')
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Join InvoiceFlowPro</h1>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-zinc-500">Validating invitation...</p>
            </div>
          ) : error && !email ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Invalid Invitation</h2>
              <p className="text-zinc-500">{error}</p>
            </div>
          ) : (
            <>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                You've been invited to join as a team member. Create your password to accept the invitation and access your dashboard.
              </p>
              
              {error && (
                <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Create Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full mt-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Accept Invitation <ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
`;
fs.writeFileSync('app/invite/page.tsx', content, 'utf8');
