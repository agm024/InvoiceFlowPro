'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Something went wrong!</h2>
      <p className="text-zinc-500 max-w-md mb-8">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium rounded-xl transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
