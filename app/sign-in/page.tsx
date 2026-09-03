'use client'

import Link from 'next/link'
import { ArrowRight, Loader2, Check } from 'lucide-react'
import { signInAction, signInWithGoogleAction } from './actions'
import { useState, Suspense } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

function SignInForm() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const authError = searchParams.get('error')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await signInAction(formData)
      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
      }
    } catch (e) {
      // next-auth redirects throw errors which we shouldn't catch or just ignore here
    }
  }

  return (
    <>
      {registered && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
          <Check size={16} />
          Account created successfully! Please sign in.
        </div>
      )}
      {authError === 'AccessDenied' && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium border border-orange-200 dark:border-orange-900">
          No account exists with that Google email. Please create a new account using the Sign Up page.
        </div>
      )}
      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
          <input type="email" name="email" required placeholder="you@company.com" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">Forgot password?</Link>
          </div>
          <input type="password" name="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
          <label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</label>
        </div>
        
        <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign in <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
      
      <form action={signInWithGoogleAction} className="mt-6">
        <button type="submit" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Sign in with Google
        </button>
      </form>
    </>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white dark:text-zinc-900 font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">InvoiceFlow<span className="text-blue-600">Pro</span></span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Please enter your details to sign in.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-xl">
          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-zinc-400" size={24} /></div>}>
            <SignInForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account? <Link href="/sign-up" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


