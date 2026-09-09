
'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6 text-red-600 dark:text-red-400">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">A critical error occurred while processing your request. Our team has been notified.</p>
      <div className="flex items-center gap-4">
        <button onClick={() => window.location.reload()} className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
          Refresh Page
        </button>
        <button onClick={() => reset()} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors">
          Try Again
        </button>
      </div>
    </div>
  )
}
