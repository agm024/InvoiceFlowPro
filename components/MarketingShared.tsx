import Link from 'next/link'
import { auth } from '@/auth'
import { MarketingNavClient } from './MarketingNavClient'

export async function MarketingNav() {
  const session = await auth()
  return <MarketingNavClient isLoggedIn={!!session?.user} />
}

export function MarketingFooter() {
  return (
    <footer className="py-12 mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">I</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              InvoiceFlow<span className="text-blue-600 dark:text-blue-500">Pro</span>
            </span>
          </Link>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
            Simple invoicing for growing businesses. Spend less time managing invoices and more time running your business.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-zinc-900 dark:text-white">Navigation</h4>
          <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link href="#features" className="hover:text-blue-600 transition">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-blue-600 transition">Pricing</Link></li>
            <li><Link href="#faq" className="hover:text-blue-600 transition">FAQ</Link></li>
            <li><Link href="/sign-in" className="hover:text-blue-600 transition">Login</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-zinc-900 dark:text-white">Legal</h4>
          <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-blue-600 transition">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 dark:text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} InvoiceFlowPro is a product by Global One Logistics & Distribution.
        </p>
      </div>
    </footer>
  )
}
