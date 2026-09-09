import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { MarketingFAQ } from '@/components/MarketingFAQ'
import { ArrowRight, CheckCircle2, FileText, Users, Clock, Globe, ShieldCheck, FilePlus, IndianRupee, PieChart, LineChart, Activity, Zap, Play } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export const metadata = {
  title: 'InvoiceFlowPro — Simple Invoicing & Payment Tracking',
  description: 'Create professional invoices, manage customers, and track payments with InvoiceFlowPro. Simple invoicing for logistics, distribution, and growing businesses.',
}

export default async function LandingPage() {
  const session = await auth()
  const dashboardHref = session?.user ? '/app' : '/sign-up'
  
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyPrice: 'asc' }
  })

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-blue-500/30">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">
        
        {/* 2. Hero Section */}
        <section className="relative w-full px-6 pt-24 pb-20 md:pt-32 md:pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold text-sm mb-6 border border-blue-100 dark:border-blue-800/30">
              Built for logistics, transport, distribution, and growing businesses.
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-zinc-900 dark:text-white leading-[1.1] mb-6">
              Invoice Faster. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Get Paid Sooner.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium max-w-xl">
              Create professional invoices, manage customers, track payments, and keep your business billing organized — without spreadsheets or complicated accounting software.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link href={dashboardHref} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-blue-700 shadow-lg shadow-blue-600/20 text-lg">
                Start Free <ArrowRight size={20} />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-xl font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 text-lg shadow-sm">
                <Play size={20} className="fill-zinc-900 dark:fill-white" /> See How It Works
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500"/> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500"/> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500"/> Professional invoices</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500"/> Multi-currency support</span>
            </div>
          </div>

          <div className="relative z-10 w-full lg:h-[600px] flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
             
             {/* Realistic Dashboard Mockup */}
             <div className="w-full bg-white dark:bg-[#121214] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
               {/* App Header */}
               <div className="h-14 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-6 gap-4 bg-zinc-50/50 dark:bg-[#09090b]/50">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="ml-auto flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                   <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                 </div>
               </div>
               
               {/* App Body */}
               <div className="p-6 flex flex-col gap-6">
                 <div className="flex justify-between items-end">
                   <div>
                     <h2 className="text-xl font-bold">Dashboard</h2>
                     <p className="text-xs text-zinc-500">Welcome back, Admin</p>
                   </div>
                   <div className="h-8 w-28 bg-blue-600 rounded-lg flex items-center justify-center text-xs text-white font-semibold shadow-sm">+ New Invoice</div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181b]">
                       <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Revenue</div>
                       <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">₹4,52,310</div>
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181b]">
                       <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Paid</div>
                       <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-500">₹3,21,000</div>
                    </div>
                    <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181b]">
                       <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Pending</div>
                       <div className="text-2xl font-black tracking-tight text-amber-500 dark:text-amber-400">₹1,31,310</div>
                    </div>
                 </div>

                 <div className="flex-1 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#121214]">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 font-semibold text-sm">Recent Invoices</div>
                    <div className="p-4 space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="flex flex-col"><span className="text-sm font-bold">Global Freight Co.</span><span className="text-xs text-zinc-500">INV-0042</span></div>
                          <div className="text-sm font-bold">₹85,000</div>
                          <div className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded">Pending</div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex flex-col"><span className="text-sm font-bold">Apex Distribution</span><span className="text-xs text-zinc-500">INV-0041</span></div>
                          <div className="text-sm font-bold">₹1,12,500</div>
                          <div className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded">Paid</div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex flex-col"><span className="text-sm font-bold">North Star Logistics</span><span className="text-xs text-zinc-500">INV-0040</span></div>
                          <div className="text-sm font-bold">₹42,000</div>
                          <div className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded">Paid</div>
                       </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* 3. Trust / Value Strip */}
        <section className="w-full bg-zinc-50 dark:bg-[#121214] py-12 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Everything you need to manage your billing</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-600 dark:text-zinc-300 font-medium">
              <div className="flex items-center justify-center gap-2"><Zap className="text-blue-500 w-5 h-5"/> Create invoices in seconds</div>
              <div className="flex items-center justify-center gap-2"><PieChart className="text-blue-500 w-5 h-5"/> Track paid & pending</div>
              <div className="flex items-center justify-center gap-2"><Users className="text-blue-500 w-5 h-5"/> Manage customers</div>
              <div className="flex items-center justify-center gap-2"><Globe className="text-blue-500 w-5 h-5"/> Multi-currency support</div>
            </div>
          </div>
        </section>

        {/* 4. Problem Section */}
        <section className="w-full py-32 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Still Managing Invoices Manually?</h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-16">
            Spreadsheets, scattered payment records, and repetitive invoice creation make billing harder than it needs to be.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Manual invoice creation</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Stop recreating the same invoice information again and again.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Lost payment visibility</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Know exactly which invoices are paid, pending, or overdue.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Scattered customer data</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Keep customers, invoices, and payment history organized in one place.</p>
            </div>
          </div>
          
          <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            InvoiceFlowPro brings it all together.
          </div>
        </section>

        {/* 5. Features Section */}
        <section id="features" className="w-full py-32 bg-zinc-50 dark:bg-[#121214] border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything You Need to Run Your Billing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <FilePlus className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Create invoices in seconds</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Generate professional invoices without starting from scratch.</p>
              </div>
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <LineChart className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Know what has been paid</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Track paid, pending, and overdue invoices from one dashboard.</p>
              </div>
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Users className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Manage your customers</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Keep customer details and billing history organized.</p>
              </div>
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <ShieldCheck className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Keep your team in sync</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Give your team controlled access with role-based permissions.</p>
              </div>
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Globe className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Bill customers anywhere</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Support multiple currencies for domestic and international customers.</p>
              </div>
              <div className="bg-white dark:bg-[#09090b] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Clock className="w-10 h-10 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Secure business data</h3>
                <p className="text-zinc-600 dark:text-zinc-400">Use secure authentication, controlled access, and reliable cloud infrastructure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Product Showcase */}
        <section className="w-full py-32 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <div className="bg-zinc-100 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl h-64 mb-6 flex items-center justify-center overflow-hidden relative shadow-sm">
                 <PieChart className="w-24 h-24 text-zinc-300 dark:text-zinc-800 absolute -right-4 -bottom-4" />
                 <div className="text-center z-10 px-6">
                   <div className="text-3xl font-black text-blue-600">₹4,52,310</div>
                   <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mt-2">Total Revenue</div>
                 </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Dashboard</h3>
              <p className="text-zinc-600 dark:text-zinc-400">See your business billing at a glance.</p>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-zinc-100 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl h-64 mb-6 p-6 flex flex-col gap-3 overflow-hidden shadow-sm">
                <div className="h-6 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                <div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
                <div className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 space-y-2 bg-white dark:bg-[#09090b]">
                   <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                   <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                   <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Invoice creation</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Create professional invoices in seconds.</p>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-zinc-100 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl h-64 mb-6 p-6 overflow-hidden shadow-sm flex flex-col gap-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center gap-4 bg-white dark:bg-[#09090b] p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                     <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">{i}</div>
                     <div className="flex flex-col gap-1">
                       <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                       <div className="h-2 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded"></div>
                     </div>
                   </div>
                 ))}
              </div>
              <h3 className="text-xl font-bold mb-2">Customer management</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Keep customer information and invoice history organized.</p>
            </div>
          </div>
        </section>

        {/* 7. How It Works */}
        <section id="how-it-works" className="w-full py-32 bg-zinc-50 dark:bg-[#121214] border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Start Invoicing in Three Simple Steps</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-24 right-24 h-0.5 bg-zinc-200 dark:bg-zinc-800"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white dark:bg-[#09090b] border-4 border-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-blue-600 mb-6 shadow-xl">
                  01
                </div>
                <h3 className="text-2xl font-bold mb-4">Add Your Customers</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Create or import your customer records.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white dark:bg-[#09090b] border-4 border-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-blue-600 mb-6 shadow-xl">
                  02
                </div>
                <h3 className="text-2xl font-bold mb-4">Create an Invoice</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Select a customer, add your items, and generate a professional invoice.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white dark:bg-[#09090b] border-4 border-blue-600 rounded-full flex items-center justify-center text-3xl font-black text-blue-600 mb-6 shadow-xl">
                  03
                </div>
                <h3 className="text-2xl font-bold mb-4">Track Your Payments</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">See what's paid, pending, and overdue from your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. India / GST Positioning */}
        <section className="w-full py-32 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full mb-6">
            <IndianRupee size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for Indian Businesses</h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12">
            Fully equipped with local tax calculations and currency formatting to keep you compliant and organized.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
            <span className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">GST-ready invoicing</span>
            <span className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">Indian currency support</span>
            <span className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">Professional invoice PDFs</span>
            <span className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">Easy customer management</span>
            <span className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">Payment tracking</span>
          </div>
        </section>

        {/* 9. Pricing */}
        <section id="pricing" className="w-full py-32 bg-zinc-50 dark:bg-[#121214] border-y border-zinc-200 dark:border-zinc-800">
          <div className="text-center mb-20 max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Pricing</h2>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch relative">
            {plans.slice(0, 3).map((plan, index) => {
              const isRecommended = plan.name.toLowerCase() === 'pro';
              return (
                <div key={plan.id} className={`relative flex flex-col bg-white dark:bg-[#09090b] rounded-3xl p-8 transition-transform duration-300 ${isRecommended ? 'border-2 border-blue-600 shadow-xl shadow-blue-600/10 scale-105 md:z-10' : 'border border-zinc-200 dark:border-zinc-800 shadow-sm'}`}>
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                      Recommended
                    </div>
                  )}
                  
                  <h3 className="text-xl font-black mb-1 uppercase tracking-wider">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6 h-10">
                    {index === 0 ? "Perfect for getting started." : index === 1 ? "For growing businesses." : "For high-volume needs."}
                  </p>
                  
                  <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tighter">
                      {plan.monthlyPrice === 0 && index === 2 ? 'Custom' : plan.monthlyPrice === 0 ? '₹0' : `₹${plan.monthlyPrice}`}
                    </span>
                    {plan.monthlyPrice > 0 && <span className="text-zinc-500 font-medium">/ month</span>}
                  </div>
                  
                  <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-8"></div>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{plan.userLimits === null ? 'Unlimited Users' : `Up to ${plan.userLimits} Users`}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{plan.clientLimits === null ? 'Unlimited Clients' : `Up to ${plan.clientLimits} Clients`}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{plan.invoiceLimits === null ? 'Unlimited Invoices' : `Up to ${plan.invoiceLimits} Invoices`}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium text-sm">{plan.name.toLowerCase() === 'free' ? 'Watermarked PDFs' : 'Remove Watermarks'}</span>
                    </li>
                  </ul>
                  
                  <Link 
                    href="/sign-up" 
                    className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all ${isRecommended ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                  >
                    {plan.monthlyPrice === 0 && index !== 2 ? 'Start Free' : 'Get Started'}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. Social Proof */}
        <section className="w-full py-24 text-center px-6">
           <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white max-w-2xl mx-auto">
             "Designed for businesses that want simpler, more organized invoicing."
           </h3>
        </section>

        {/* 11. FAQ */}
        <section id="faq" className="w-full py-32 bg-zinc-50 dark:bg-[#121214] border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
            <MarketingFAQ />
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="w-full py-32 bg-blue-600 text-white text-center px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">Ready to Simplify Your Invoicing?</h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 font-medium">Spend less time managing invoices and more time running your business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform text-lg shadow-xl">
                Start Free
              </Link>
              <Link href="/sign-in" className="bg-blue-700 border border-blue-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors text-lg">
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
