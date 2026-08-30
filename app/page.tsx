import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { auth } from '@/auth'

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-in'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Navbar */}
      <MarketingNav />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          The invoicing OS for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">modern businesses.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Everything you need to create beautiful invoices, track expenses, and manage clients in one unified platform. Built for scale.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Link href={dashboardHref} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg">
              Start your free trial <ArrowRight size={20} />
            </Link>
          )}
          <Link href="#features" className="bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-800 transition flex items-center justify-center text-lg">
            See how it works
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
          <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg mb-2">Beautiful Invoices</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Create professional, customized invoices in seconds. Get paid faster with integrated payment links.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg mb-2">Client Portal</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Give your clients a dedicated portal to view their active projects, outstanding balances, and payment history.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg mb-2">Expense Tracking</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Monitor your cash flow seamlessly. Log expenses and attach receipts directly to specific client projects.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}




