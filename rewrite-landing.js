const fs = require('fs');
const content = `import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { ArrowRight, CheckCircle2, Zap, Users, Globe, Receipt } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-in'
  
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Navbar */}
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 border border-blue-100 dark:border-blue-800">
            <Zap size={16} />
            <span>Now with Unlimited Free Invoices</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Global One Logistics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Distribution OS.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to create beautiful invoices, track expenses, and manage clients in one unified platform. Start completely free today.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            {session ? (
              <Link href={dashboardHref} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-lg">
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-lg">
                Start for free <ArrowRight size={20} />
              </Link>
            )}
            <Link href="#pricing" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all flex items-center justify-center text-lg shadow-sm">
              View Pricing
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-white dark:bg-zinc-900/50 py-24 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful features for modern teams</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">Everything you need to run your logistics and distribution billing smoothly.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                  <Receipt size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3">Unlimited Invoices</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Create professional, customized invoices and estimates in seconds. No caps or limits on our generous free tier.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                  <Users size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3">Team Management</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Invite team members with custom role-based access. Collaborate securely without ever sharing your credentials.</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <Globe size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3">Global Multi-Currency</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Bill international clients accurately in their local currency. Log business expenses and attach receipts directly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
            {plans.map(plan => (
              <div key={plan.id} className={\`flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-8 border \${plan.isPopular ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-zinc-200 dark:border-zinc-800'} relative\`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">{plan.currency === 'USD' ? '$' : '₹'}{plan.monthlyPrice}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">/mo</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{plan.userLimits === null ? 'Unlimited Users' : \`Up to \${plan.userLimits} Users\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{plan.clientLimits === null ? 'Unlimited Clients' : \`Up to \${plan.clientLimits} Clients\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{plan.invoiceLimits === null ? 'Unlimited Invoices' : \`Up to \${plan.invoiceLimits} Invoices\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300">{plan.name.toLowerCase() === 'free' ? 'Watermarked PDFs' : 'Remove Watermarks'}</span>
                  </li>
                </ul>
                
                <Link 
                  href="/sign-up" 
                  className={\`w-full py-4 px-6 rounded-xl font-bold text-center transition-all \${plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'}\`}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started' : 'Subscribe Now'}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  )
}
`;
fs.writeFileSync('app/page.tsx', content, 'utf8');

// Also update the footer in MarketingShared.tsx
let footerText = fs.readFileSync('components/MarketingShared.tsx', 'utf8');
footerText = footerText.replace(
    /&copy; \{new Date\(\)\.getFullYear\(\)\} InvoiceFlowPro\. All rights reserved\./g,
    '&copy; {new Date().getFullYear()} Global One Logistics And Distribution. All rights reserved.'
);
fs.writeFileSync('components/MarketingShared.tsx', footerText, 'utf8');
