const fs = require('fs');

const content = `import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { ArrowRight, CheckCircle2, FileText, Users, Clock, Download, History, LineChart, Cloud, Smartphone, ShieldCheck } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-in'
  
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' }
  })

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">
        {/* Minimal Hero Section */}
        <section className="w-full px-6 pt-32 pb-24 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            invoice.siteradiant.co.in/app
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto mb-8">
            Create, Manage & Track Invoices — All in One Place
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
            Simplify your invoicing workflow with a secure, easy-to-use online invoice management platform. Built for businesses, vendors, and freelancers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href={dashboardHref} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link href="/sign-up" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                Get Started <ArrowRight size={18} />
              </Link>
            )}
            <Link href="/sign-in" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition flex items-center justify-center">
              Sign In
            </Link>
          </div>
        </section>

        {/* Clean Features Grid */}
        <section id="features" className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Everything you need to run your business</h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">A complete suite of tools for your invoicing and finance needs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {[
                { icon: <FileText className="text-zinc-900 dark:text-white" />, title: 'Professional Invoices', desc: 'Create and send customized invoices in seconds.' },
                { icon: <Users className="text-zinc-900 dark:text-white" />, title: 'Manage Customers', desc: 'Keep your vendors and clients organized centrally.' },
                { icon: <Clock className="text-zinc-900 dark:text-white" />, title: 'Track Status', desc: 'Monitor paid, pending, and overdue invoices easily.' },
                { icon: <Download className="text-zinc-900 dark:text-white" />, title: 'Download & Share', desc: 'Export to PDF or share via secure online links.' },
                { icon: <History className="text-zinc-900 dark:text-white" />, title: 'Invoice History', desc: 'Access a complete audit trail of your documents.' },
                { icon: <LineChart className="text-zinc-900 dark:text-white" />, title: 'Financial Insights', desc: 'View revenue summaries and key metrics instantly.' },
                { icon: <Cloud className="text-zinc-900 dark:text-white" />, title: 'Secure Cloud', desc: 'Reliable cloud storage with automated backups.' },
                { icon: <Smartphone className="text-zinc-900 dark:text-white" />, title: 'Mobile-Friendly', desc: 'Access and manage your business from any device.' },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clean 3-Step Process */}
        <section className="w-full py-24 bg-white dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { step: '1', title: 'Create', desc: 'Add customer and invoice details using our simple, intuitive editor.' },
                 { step: '2', title: 'Send', desc: 'Generate a professional PDF or share a direct link with your client.' },
                 { step: '3', title: 'Track', desc: 'Monitor payment status and history from your comprehensive dashboard.' }
               ].map((s, i) => (
                 <div key={i} className="flex flex-col items-center text-center">
                   <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xl flex items-center justify-center mb-6">
                      {s.step}
                   </div>
                   <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                   <p className="text-zinc-600 dark:text-zinc-400">{s.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Real-looking Dashboard Preview */}
        <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Total control over your financials</h2>
               <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                 Our dashboard provides everything you need at a glance. Navigate your business health seamlessly.
               </p>
             </div>
             
             {/* Clean Semantic UI Mockup */}
             <div className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 hidden md:block">
                  <div className="font-bold text-lg mb-8">InvoiceFlow</div>
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-md text-sm font-medium">Dashboard</div>
                    <div className="px-3 py-2 text-zinc-500 text-sm font-medium">Invoices</div>
                    <div className="px-3 py-2 text-zinc-500 text-sm font-medium">Clients</div>
                    <div className="px-3 py-2 text-zinc-500 text-sm font-medium">Reports</div>
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-2xl font-bold">Overview</h3>
                     <div className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Create Invoice</div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                       <div className="text-sm text-zinc-500 mb-1">Total Revenue</div>
                       <div className="text-xl font-bold">$45,231.00</div>
                     </div>
                     <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                       <div className="text-sm text-zinc-500 mb-1">Paid</div>
                       <div className="text-xl font-bold text-green-600">$32,100.00</div>
                     </div>
                     <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                       <div className="text-sm text-zinc-500 mb-1">Pending</div>
                       <div className="text-xl font-bold text-amber-600">$10,400.00</div>
                     </div>
                     <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                       <div className="text-sm text-zinc-500 mb-1">Overdue</div>
                       <div className="text-xl font-bold text-red-600">$2,731.00</div>
                     </div>
                   </div>
                   <h4 className="font-semibold mb-4">Recent Invoices</h4>
                   <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                     <div className="grid grid-cols-4 gap-4 p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-500 uppercase">
                       <div>Invoice ID</div>
                       <div>Client</div>
                       <div>Amount</div>
                       <div>Status</div>
                     </div>
                     {[
                       { id: 'INV-001', client: 'Acme Corp', amount: '$4,500.00', status: 'Paid', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
                       { id: 'INV-002', client: 'Global Tech', amount: '$2,100.00', status: 'Pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                       { id: 'INV-003', client: 'Stark Ind.', amount: '$8,950.00', status: 'Overdue', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' }
                     ].map((inv, i) => (
                       <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b border-zinc-100 dark:border-zinc-800 text-sm items-center">
                         <div className="font-medium">{inv.id}</div>
                         <div className="text-zinc-600 dark:text-zinc-400">{inv.client}</div>
                         <div>{inv.amount}</div>
                         <div>
                           <span className={\`px-2 py-1 rounded-full text-xs font-medium \${inv.color}\`}>{inv.status}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="w-full py-24 bg-white dark:bg-zinc-950 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-zinc-900 dark:text-white" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your invoices. Your data. Securely managed.</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
              We employ strict security measures, reliable cloud storage, and controlled account access to protect your business data at all times.
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> Secure Access</div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> Data Protection</div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-600" /> Cloud Storage</div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {plans.map(plan => (
              <div key={plan.id} className={\`flex flex-col bg-white dark:bg-zinc-950 rounded-2xl p-8 border \${plan.isPopular ? 'border-blue-600 shadow-lg' : 'border-zinc-200 dark:border-zinc-800'}\`}>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.currency === 'USD' ? '$' : '₹'}{plan.monthlyPrice}</span>
                  <span className="text-zinc-500 font-medium">/mo</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white shrink-0" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{plan.userLimits === null ? 'Unlimited Users' : \`Up to \${plan.userLimits} Users\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white shrink-0" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{plan.clientLimits === null ? 'Unlimited Clients' : \`Up to \${plan.clientLimits} Clients\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white shrink-0" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{plan.invoiceLimits === null ? 'Unlimited Invoices' : \`Up to \${plan.invoiceLimits} Invoices\`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-white shrink-0" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{plan.name.toLowerCase() === 'free' ? 'Watermarked PDFs' : 'Remove Watermarks'}</span>
                  </li>
                </ul>
                
                <Link 
                  href="/sign-up" 
                  className={\`w-full py-3 px-6 rounded-lg font-medium text-center transition-all \${plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'}\`}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started' : 'Subscribe'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-32 bg-white dark:bg-zinc-950 text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Ready to simplify your invoicing?</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">Start managing your invoices smarter with our easy-to-use online platform.</p>
            <Link href={dashboardHref} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all text-lg">
              Open Invoice App
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
