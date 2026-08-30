import Link from 'next/link'
import { auth } from '@/auth'

export async function MarketingNav() {
  const session = await auth()
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 max-w-7xl mx-auto w-full border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
          <span className="text-white dark:text-zinc-900 font-bold text-xl">I</span>
        </div>
        <span className="font-bold text-xl tracking-tight">InvoiceFlow<span className="text-blue-600 dark:text-blue-500">Pro</span></span>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Pricing</Link>
        <Link href="/contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Contact</Link>
        {session ? (
          <Link href="/app" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-zinc-200 transition">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/sign-in" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
              Log in
            </Link>
            <Link href="/sign-up" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-zinc-200 transition">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export function MarketingFooter() {
  return (
    <footer className="py-12 mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/sign-in">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund-policy">Refund &amp; Cancellation</Link></li>
            <li><Link href="/dpa">Data Processing Agreement</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} InvoiceFlowPro. All rights reserved.
      </div>
    </footer>
  )
}



