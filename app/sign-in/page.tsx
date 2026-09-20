'use client'

import Link from 'next/link'
import { ArrowRight, Loader2, Check } from 'lucide-react'
import { signInAction, signInWithGoogleAction } from './actions'
import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'

function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const authError = searchParams.get('error')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setFormError('')
    
    // Explicitly grab the Turnstile token if it didn't get caught in formData
    const turnstileToken = (document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement)?.value;
    if (turnstileToken && !formData.get('cf-turnstile-response')) {
      formData.append('cf-turnstile-response', turnstileToken);
    }
    
    try {
      const result = await signInAction(formData)
      if (result?.error) {
        setFormError(result.error)
        setLoading(false)
      }
    } catch (e) {
      // next-auth redirects throw errors which we shouldn't catch or just ignore here
    }
  }

  return (
    <>
      {loading && !formError && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
          <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Securing your session...</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Entering dashboard</p>
        </div>
      )}
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
          <input type="email" name="email" required placeholder="you@company.com" className={`w-full px-4 py-2.5 rounded-xl border ${formError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500'} bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-1 transition-all`} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link href="#" className="text-sm text-cyan-500 dark:text-blue-500 hover:underline">Forgot password?</Link>
          </div>
          <input type="password" name="password" required placeholder="••••••••" className={`w-full px-4 py-2.5 rounded-xl border ${formError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500'} bg-zinc-50/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-1 transition-all`} />
          {formError && (
            <p className="text-sm text-red-500 font-medium mt-1.5">{formError}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="rounded border-zinc-300 text-cyan-500 focus:ring-blue-500 h-4 w-4" />
          <label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</label>
        </div>

        <Turnstile siteKey={process.env.NODE_ENV === 'development' ? '1x00000000000000000000AA' : (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA')} options={{ action: 'login' }} onSuccess={(token) => setTurnstileToken(token)} onExpire={() => setTurnstileToken(null)} onError={() => setTurnstileToken(null)} />
        
        <button disabled={loading || !turnstileToken} type="submit" className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign in <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
      
      <div className="mt-6 flex flex-col gap-3">
        <button onClick={() => signIn('google', { callbackUrl: '/app' })} type="button" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          Sign in with Google
        </button>
        
        <button onClick={() => signIn('github', { callbackUrl: '/app' })} type="button" className="w-full bg-[#24292F] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#24292F]/90 transition-colors flex items-center justify-center gap-3">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          Sign in with GitHub
        </button>
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="w-full max-w-[400px] mt-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="flex items-center gap-3 mb-8 w-fit mx-auto">
          <img src="/logo.png" alt="FlowRadiant Logo" className="w-10 h-10 rounded-xl shadow-sm" />
          <span className="font-bold text-2xl tracking-tight">FlowRadiant<span className="text-cyan-500">Pro</span></span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Please enter your details to sign in.</p>

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


