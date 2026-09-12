import Link from 'next/link'
import { auth } from '@/auth'
import { MarketingNavClient } from './MarketingNavClient'

export async function MarketingNav() {
  const session = await auth()
  return <MarketingNavClient isLoggedIn={!!session?.user} />
}

export function MarketingFooter() {
  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-base leading-none">I</span>
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                FlowRadiant<span className="text-cyan-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              Simple, professional invoicing for logistics, transport, distribution, and growing Indian businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/dpa" className="hover:text-white transition-colors">Data Processing</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} FlowRadiant — a product by Global One Logistics &amp; Distribution.</p>
          <Link href="/sign-up" className="text-cyan-500 hover:text-blue-400 font-semibold transition-colors">
            Start Free →
          </Link>
        </div>
      </div>
    </footer>
  )
}
