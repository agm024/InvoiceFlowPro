const fs = require('fs');
const content = `import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { ArrowRight, CheckCircle2, FileText, Users, Clock, Download, LineChart, ShieldCheck, CreditCard, Sparkles, Receipt } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-in'
  
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' }
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-blue-500/30">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">
        {/* Modern Hero with Glow Effects */}
        <section className="relative w-full px-6 pt-32 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md mb-8 shadow-sm">
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium tracking-tight text-zinc-800 dark:text-zinc-300">
              invoice.siteradiant.co.in/app is now live
            </span>
          </div>
          
          <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tighter text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.05] mb-8">
            Invoicing, <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600">reimagined.</span>
          </h1>
          
          <p className="relative z-10 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Create professional invoices, manage customers, and track global payments in one unified, blazingly fast platform. 
          </p>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            {session ? (
              <Link href={dashboardHref} className="group relative inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                Go to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link href="/sign-up" className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 hover:bg-blue-700 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          {/* Hero Dashboard Glass Mockup */}
          <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-500/20 blur-2xl -z-10 rounded-3xl"></div>
             <div className="bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-2xl p-4 md:p-6 ring-1 ring-black/5 dark:ring-white/5">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                   <div className="col-span-1 hidden md:flex flex-col gap-2 border-r border-zinc-200/50 dark:border-zinc-800/50 pr-4">
                     <div className="h-8 w-8 rounded-lg bg-blue-600 mb-6"></div>
                     <div className="h-8 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/50"></div>
                     <div className="h-8 w-full rounded-md bg-transparent"></div>
                     <div className="h-8 w-full rounded-md bg-transparent"></div>
                   </div>
                   <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                           <div className="text-xs font-medium text-zinc-500 mb-1">Revenue</div>
                           <div className="text-2xl font-bold tracking-tight">$45,231</div>
                        </div>
                        <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                           <div className="text-xs font-medium text-zinc-500 mb-1">Paid</div>
                           <div className="text-2xl font-bold tracking-tight text-green-500">$32,100</div>
                        </div>
                        <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
                           <div className="text-xs font-medium text-zinc-500 mb-1">Pending</div>
                           <div className="text-2xl font-bold tracking-tight text-amber-500">$10,400</div>
                        </div>
                     </div>
                     <div className="flex-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm font-semibold">Recent Invoices</div>
                          <div className="h-6 w-20 rounded-md bg-blue-600/10 border border-blue-600/20"></div>
                        </div>
                        <div className="space-y-2">
                           {[1,2,3].map(i => (
                             <div key={i} className="flex justify-between items-center p-2 rounded-md hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600"></div>
                                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                                </div>
                                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                             </div>
                           ))}
                        </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="w-full py-32 bg-white dark:bg-[#09090b] relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">Designed for speed & scale</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Everything you need to run your logistics and distribution billing smoothly, wrapped in a beautiful interface.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
              {/* Card 1: Large */}
              <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden bg-zinc-50 dark:bg-[#121214] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-700">
                  <FileText size={120} className="text-blue-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-end max-w-md">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm">
                    <Receipt className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Unlimited Invoices</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">Create professional, customized invoices and estimates in seconds. No caps or limits on our generous free tier.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden bg-zinc-50 dark:bg-[#121214] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 hover:border-purple-500/50 transition-colors duration-500">
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <Users className="text-purple-600 dark:text-purple-400 w-8 h-8" />
                   <div>
                     <h3 className="text-xl font-bold mb-2 tracking-tight">Team Management</h3>
                     <p className="text-zinc-600 dark:text-zinc-400 text-sm">Invite members with custom role-based access securely.</p>
                   </div>
                 </div>
              </div>

              {/* Card 3 */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden bg-zinc-50 dark:bg-[#121214] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 hover:border-emerald-500/50 transition-colors duration-500">
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <CreditCard className="text-emerald-600 dark:text-emerald-400 w-8 h-8" />
                   <div>
                     <h3 className="text-xl font-bold mb-2 tracking-tight">Global Currency</h3>
                     <p className="text-zinc-600 dark:text-zinc-400 text-sm">Bill international clients accurately in their local currency.</p>
                   </div>
                 </div>
              </div>
              
              {/* Card 4 */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden bg-zinc-50 dark:bg-[#121214] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-8 hover:border-amber-500/50 transition-colors duration-500">
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <Clock className="text-amber-600 dark:text-amber-400 w-8 h-8" />
                   <div>
                     <h3 className="text-xl font-bold mb-2 tracking-tight">Real-time Tracking</h3>
                     <p className="text-zinc-600 dark:text-zinc-400 text-sm">Monitor paid, pending, and overdue invoices effortlessly.</p>
                   </div>
                 </div>
              </div>
              
              {/* Card 5: Wide */}
              <div className="md:col-span-2 md:row-span-1 group relative overflow-hidden bg-zinc-900 dark:bg-white rounded-3xl border border-zinc-800 dark:border-zinc-200 p-8 text-white dark:text-zinc-900">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <ShieldCheck className="w-8 h-8 mb-4 text-blue-400 dark:text-blue-600" />
                   <div>
                     <h3 className="text-2xl font-bold mb-2 tracking-tight">Bank-grade Security</h3>
                     <p className="text-zinc-400 dark:text-zinc-600 max-w-lg">We employ strict 256-bit encryption, reliable cloud storage, and controlled account access to protect your business data at all times.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Modernized */}
        <section id="pricing" className="w-full py-32 bg-zinc-50 dark:bg-[#121214] border-y border-zinc-200/50 dark:border-zinc-800">
          <div className="text-center mb-20 max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Start for free, upgrade when your logistics business demands more power.</p>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch relative">
            {plans.map(plan => (
              <div key={plan.id} className={\`relative flex flex-col bg-white dark:bg-[#09090b] rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-2 \${plan.isPopular ? 'border-2 border-blue-600 shadow-2xl shadow-blue-600/10' : 'border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none'}\`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/30">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tighter">{plan.currency === 'USD' ? '$' : '₹'}{plan.monthlyPrice}</span>
                  <span className="text-zinc-500 font-medium">/mo</span>
                </div>
                
                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-8"></div>
                
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{plan.userLimits === null ? 'Unlimited Users' : \`Up to \${plan.userLimits} Users\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{plan.clientLimits === null ? 'Unlimited Clients' : \`Up to \${plan.clientLimits} Clients\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{plan.invoiceLimits === null ? 'Unlimited Invoices' : \`Up to \${plan.invoiceLimits} Invoices\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{plan.name.toLowerCase() === 'free' ? 'Watermarked PDFs' : 'Remove Watermarks'}</span>
                  </li>
                </ul>
                
                <Link 
                  href="/sign-up" 
                  className={\`w-full py-4 px-6 rounded-xl font-bold text-center transition-all \${plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'}\`}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Subscribe Now'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative w-full py-32 bg-white dark:bg-[#09090b] text-center px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-blue-900/20 dark:via-[#09090b] dark:to-[#09090b] pointer-events-none"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-white mb-6">Ready to simplify your invoicing?</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 font-medium">Join thousands of modern businesses managing their finances smarter.</p>
            <Link href={dashboardHref} className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-5 rounded-full font-bold hover:scale-105 transition-transform text-lg shadow-2xl shadow-zinc-900/20 dark:shadow-white/10">
              Open Invoice App <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
`
fs.writeFileSync('app/page.tsx', content, 'utf8');
