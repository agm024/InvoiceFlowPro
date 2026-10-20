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
              <img src="/logo.png" alt="FlowRadiantPro Logo by SiteRadiant" width={32} height={32} className="w-8 h-8 rounded-xl" />
              <span className="font-black text-lg tracking-tight text-white">
                FlowRadiant<span className="text-cyan-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              The all-in-one Business OS and GST invoicing software for Indian SMBs, freelancers, and growing agencies. Built by{' '}
              <a
                href="https://github.com/agm024"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white underline"
              >
                Agastya (agm024)
              </a>{' '}
              at SiteRadiant.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing &amp; Plans</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About FlowRadiantPro</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Log In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white text-sm uppercase tracking-wider">Legal &amp; Creator</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://github.com/agm024" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Creator: Agastya (GitHub)</a></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/dpa" className="hover:text-white transition-colors">Data Processing</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Global One Logistics And Distribution. All rights reserved.</p>
          <p>
            Crafted with care by{' '}
            <a
              href="https://github.com/agm024"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white underline"
            >
              Agastya
            </a>{' '}
            at{' '}
            <a href="https://siteradiant.co.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
              SiteRadiant
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
