const fs = require('fs');
const content = `import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { ArrowRight, FileText, Users, Clock, Download, History, LineChart, Cloud, Smartphone, ShieldCheck, CheckCircle2, Shield } from 'lucide-react'
import { auth } from '@/auth'
import Image from 'next/image'

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-in'
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden bg-white dark:bg-slate-950 pt-32 pb-24 border-b border-slate-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-8 border border-blue-100 dark:border-blue-800/50">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              invoice.siteradiant.co.in/app
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white max-w-4xl">
              Create, Manage & Track Invoices — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">All in One Place</span>
            </h1>
            
            <p className="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Simplify your invoicing workflow with a secure, easy-to-use online invoice management platform.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-lg">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link href="/sign-in" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center text-lg shadow-sm">
                Sign In
              </Link>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-20 w-full max-w-6xl relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-slate-50 dark:bg-slate-900 p-2 md:p-4">
               <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm relative aspect-video flex flex-col">
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 gap-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-md h-7 max-w-md mx-auto border border-slate-200 dark:border-slate-700 flex items-center px-3">
                       <span className="text-xs text-slate-400 font-mono">invoice.siteradiant.co.in/app</span>
                    </div>
                  </div>
                  {/* Mockup Body */}
                  <div className="flex-1 p-6 grid grid-cols-4 gap-6">
                    <div className="col-span-1 border-r border-slate-100 dark:border-slate-800 pr-6 space-y-4">
                       <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-8"></div>
                       <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                       <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                       <div className="h-4 w-5/6 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800"></div>
                       <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/50 rounded-md"></div>
                    </div>
                    <div className="col-span-3 space-y-6">
                       <div className="grid grid-cols-4 gap-4">
                         {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-between"><div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-md"></div><div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-md"></div></div>)}
                       </div>
                       <div className="h-64 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
                          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded-md mb-6"></div>
                          <div className="space-y-3">
                             {[1,2,3,4].map(i => <div key={i} className="h-10 w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700"></div>)}
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Everything you need, nothing you don't</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">A premium, modern SaaS experience designed to make billing effortless.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <FileText className="text-blue-600" />, title: 'Create professional invoices', desc: 'Generate customized, professional invoices in seconds.' },
                { icon: <Users className="text-indigo-600" />, title: 'Manage customers & vendors', desc: 'Keep all your contacts organized in one secure place.' },
                { icon: <Clock className="text-amber-600" />, title: 'Track paid, pending & overdue', desc: 'Never lose track of an invoice status again.' },
                { icon: <Download className="text-emerald-600" />, title: 'Download and share invoices', desc: 'Instantly export to PDF or share via direct link.' },
                { icon: <History className="text-purple-600" />, title: 'View invoice history', desc: 'Full audit logs and chronological history of all documents.' },
                { icon: <LineChart className="text-rose-600" />, title: 'Dashboard with insights', desc: 'Clear financial metrics, revenue summaries, and analytics.' },
                { icon: <Cloud className="text-sky-600" />, title: 'Secure cloud-based access', desc: 'Your data is synced, backed up, and accessible anywhere.' },
                { icon: <Smartphone className="text-teal-600" />, title: 'Mobile-friendly experience', desc: 'Manage your finances on the go, from any device.' },
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Get paid faster in three simple steps.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 dark:from-slate-800 dark:via-blue-600 dark:to-slate-800 z-0"></div>
               
               {[
                 { step: '01', title: 'Create', desc: 'Add customer and invoice details into our streamlined editor.' },
                 { step: '02', title: 'Send', desc: 'Generate and share a professional invoice instantly via email or link.' },
                 { step: '03', title: 'Track', desc: 'Monitor payment status, overdue alerts, and invoice history.' }
               ].map((s, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-50 dark:border-slate-800 shadow-xl flex items-center justify-center mb-6">
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-500">{s.step}</span>
                   </div>
                   <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Details */}
        <section className="w-full py-24 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
             <div className="w-full lg:w-1/2 space-y-8">
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Total control over your financials</h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                 Our polished SaaS dashboard provides you with everything you need at a glance. Navigate through your business health seamlessly with advanced controls.
               </p>
               <ul className="space-y-4">
                 {[
                   'Total, Paid, Pending, and Overdue invoices',
                   'Revenue summary and financial insights',
                   'Recent invoices activity feed',
                   'Powerful search and filtering controls'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3">
                     <CheckCircle2 className="text-blue-600 shrink-0" size={24} />
                     <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="w-full lg:w-1/2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                       <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Total Revenue</p>
                       <p className="text-2xl font-bold">$124,500.00</p>
                     </div>
                     <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50">
                       <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-1">Pending</p>
                       <p className="text-2xl font-bold">$12,400.00</p>
                     </div>
                  </div>
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                          <div>
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                          </div>
                        </div>
                        <div className="h-6 w-20 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800"></div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="w-full py-24 bg-blue-900 dark:bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <Shield className="w-16 h-16 mx-auto mb-8 text-blue-300" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Your invoices. Your data. Securely managed.</h2>
            <p className="text-xl text-blue-100 mb-12">
              We employ bank-level encryption, reliable cloud storage, and strictly controlled account access to protect your business data at all times.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: '256-bit Encryption' },
                { label: 'Secure Access' },
                { label: 'Data Protection' },
                { label: 'Reliable Storage' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <ShieldCheck className="text-blue-400" size={32} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">Ready to simplify your invoicing?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">Start managing your invoices smarter with our easy-to-use online platform.</p>
            <Link href={dashboardHref} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all text-xl hover:-translate-y-1">
              Open Invoice App <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
`;
fs.writeFileSync('app/page.tsx', content, 'utf8');
