
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 text-zinc-400">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">Page not found</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.</p>
      <Link href="/app" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors">
        Return to Dashboard
      </Link>
    </div>
  )
}
