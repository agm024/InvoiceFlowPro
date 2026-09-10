import Link from 'next/link'
import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { MarketingFAQ } from '@/components/MarketingFAQ'
import {
  ArrowRight, CheckCircle2, FileText, Users, Globe,
  ShieldCheck, FilePlus, IndianRupee, LineChart,
  Activity, Zap, CheckCircle, TrendingUp, Clock,
} from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/utils/prisma'

export const metadata = {
  title: 'InvoiceFlowPro — Simple Invoicing & Payment Tracking for Indian Businesses',
  description:
    'Create professional GST-ready invoices, manage customers, and track payments with InvoiceFlowPro. Built for logistics, distribution, and growing businesses in India.',
}

export default async function LandingPage() {
  const session = await auth()
  const signupHref = session?.user ? '/app' : '/sign-up'

  const plans = await prisma.plan.findMany({ orderBy: { monthlyPrice: 'asc' } })

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-blue-500/30">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-36 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Copy */}
            <div className="flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold text-xs sm:text-sm mb-6 border border-blue-200/60 dark:border-blue-800/40">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                For logistics, transport & growing businesses
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.05] mb-6">
                Invoice Faster.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">
                  Get Paid Sooner.
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-xl">
                Create professional invoices, manage customers, track payments, and keep your business billing organized — without spreadsheets or complicated software.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
                <Link
                  href={signupHref}
                  className="group inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-7 py-4 rounded-2xl font-bold text-base transition-all hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                >
                  Start Free
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-7 py-4 rounded-2xl font-bold text-base transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  See How It Works
                </Link>
              </div>

              {/* Trust micro-badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {['Free to start', 'No credit card', 'Professional PDFs', 'GST-ready'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Dashboard Browser Mockup */}
            <div className="relative flex items-center justify-center w-full">
              {/* Glow behind mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 dark:from-blue-700/30 dark:to-indigo-700/30 blur-3xl rounded-full scale-90" />

              {/* Browser chrome */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0f0f10]">

                {/* Browser top bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-400 font-mono truncate">
                    invoice.siteradiant.co.in/app
                  </div>
                </div>

                {/* App content */}
                <div className="p-4 sm:p-5 flex flex-col gap-4">
                  {/* Page header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">Your Financial Overview</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Monitor real-time transactions</p>
                    </div>
                    <div className="hidden sm:flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm">30d</span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-400">90d</span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-400">YTD</span>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Collected Revenue</p>
                      <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 truncate">₹3,21,000</p>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">+12.4%</span>
                        <span className="text-[9px] text-zinc-400 hidden sm:inline">vs prev period</span>
                      </div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Outstanding</p>
                      <p className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 truncate">₹1,31,310</p>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">3 pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Invoices Table */}
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Top Clients</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">View All →</p>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {[
                        { name: 'Global Freight Co.', inv: 'INV-0042', amount: '₹2,85,000', status: 'paid', color: 'emerald' },
                        { name: 'Apex Distribution', inv: 'INV-0041', amount: '₹1,12,500', status: 'pending', color: 'amber' },
                        { name: 'North Star Logistics', inv: 'INV-0040', amount: '₹42,000', status: 'paid', color: 'emerald' },
                      ].map(row => (
                        <div key={row.inv} className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition">
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px] sm:max-w-none">{row.name}</p>
                            <p className="text-[10px] text-zinc-400">{row.inv}</p>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{row.amount}</p>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              row.color === 'emerald'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}>
                              {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF STRIP ───────────────────────────────────────── */}
        <section className="w-full py-8 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: 'Free', label: 'To Start' },
                { value: 'GST', label: 'Ready Invoices' },
                { value: 'Multi', label: 'Currency Support' },
                { value: 'PDF', label: 'Professional Output' },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{s.value}</p>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────────────────── */}
        <section className="w-full py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
              Still Managing Invoices Manually?
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-16">
              Spreadsheets, scattered payment records, and repetitive invoice creation make billing harder than it needs to be.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
              {[
                { icon: <FileText size={24} />, title: 'Manual invoice creation', desc: 'Stop recreating the same invoice information again and again.' },
                { icon: <Activity size={24} />, title: 'Lost payment visibility', desc: 'Never know which invoices are paid, pending, or overdue.' },
                { icon: <Users size={24} />, title: 'Scattered customer data', desc: 'Customer details scattered across WhatsApp, emails, and notebooks.' },
              ].map(p => (
                <div key={p.title} className="group p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-left hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2 text-zinc-900 dark:text-white">{p.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20">
              <Zap size={20} className="fill-white" />
              InvoiceFlowPro brings it all together.
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <section id="features" className="w-full py-24 sm:py-32 bg-zinc-50 dark:bg-[#0d0d0f] border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Features</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-[1.1]">
                Everything You Need<br className="hidden sm:block" /> to Run Your Billing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: <FilePlus className="w-6 h-6" />,
                  title: 'Create invoices in seconds',
                  desc: 'Generate professional invoices without starting from scratch. Save item templates and reuse them.',
                  color: 'blue',
                },
                {
                  icon: <LineChart className="w-6 h-6" />,
                  title: 'Know what has been paid',
                  desc: 'Track paid, pending, and overdue invoices from one clean dashboard overview.',
                  color: 'indigo',
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Manage your customers',
                  desc: 'Keep customer details, contact info, and billing history organized in one place.',
                  color: 'violet',
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: 'Keep your team in sync',
                  desc: 'Give team members role-based access. Control who can view, edit, or manage invoices.',
                  color: 'emerald',
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: 'Bill customers anywhere',
                  desc: 'Invoice in multiple currencies with accurate exchange rate tracking for international clients.',
                  color: 'cyan',
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: 'Secure business data',
                  desc: 'Secure authentication, controlled access, and reliable cloud infrastructure.',
                  color: 'slate',
                },
              ].map(f => (
                <div
                  key={f.title}
                  className="group p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2 text-zinc-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="w-full py-24 sm:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">How It Works</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">
                Start Invoicing in<br className="hidden sm:block" /> Three Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector */}
              <div className="hidden md:block absolute top-10 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-blue-300 to-blue-300 dark:from-blue-800 dark:to-blue-800" />

              {[
                { n: '01', title: 'Add Your Customers', desc: 'Create or import your customer records with addresses and contact details.' },
                { n: '02', title: 'Create an Invoice', desc: 'Select a customer, add line items, and generate a clean professional invoice.' },
                { n: '03', title: 'Track Your Payments', desc: "See what's paid, pending, and overdue directly from your dashboard." },
              ].map(step => (
                <div key={step.n} className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-blue-600/30 z-10">
                    {step.n}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-zinc-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INDIA / GST SECTION ──────────────────────────────────────── */}
        <section className="w-full py-24 sm:py-32 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/10 border-y border-orange-100 dark:border-orange-900/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mb-6">
                  <IndianRupee size={28} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-4 leading-[1.1]">
                  Built for<br />Indian Businesses
                </h2>
                <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                  Fully equipped with GST calculations, ITC tracking, and Indian Rupee formatting to keep your business billing compliant and organized.
                </p>
                <Link
                  href={signupHref}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md shadow-orange-500/20"
                >
                  Start Free Today <ArrowRight size={16} />
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { icon: <CheckCircle size={18} />, title: 'GST-ready invoicing', desc: 'Automatic CGST, SGST & IGST calculations on every invoice.' },
                  { icon: <CheckCircle size={18} />, title: 'ITC tracking', desc: 'Track input tax credits from your expenses automatically.' },
                  { icon: <CheckCircle size={18} />, title: 'Indian currency support', desc: 'Native INR formatting with lakh and crore number grouping.' },
                  { icon: <CheckCircle size={18} />, title: 'Professional PDF invoices', desc: 'Download clean, professional PDFs ready to share with clients.' },
                  { icon: <CheckCircle size={18} />, title: 'Payment tracking', desc: 'Know exactly what is collected, pending, and overdue at all times.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3.5 p-4 bg-white dark:bg-zinc-900/60 rounded-xl border border-orange-100 dark:border-orange-900/30 shadow-sm">
                    <div className="text-orange-500 shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" className="w-full py-24 sm:py-32 bg-zinc-50 dark:bg-[#0d0d0f] border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Pricing</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base">Start free. Upgrade as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
              {plans.slice(0, 3).map((plan, index) => {
                const isRecommended = plan.name.toLowerCase() === 'pro'
                const isCustom = plan.monthlyPrice === 0 && index === 2
                const priceLabel = isCustom ? 'Custom' : plan.monthlyPrice === 0 ? '₹0' : `₹${plan.monthlyPrice.toLocaleString()}`
                const planDesc = index === 0
                  ? 'Perfect for freelancers and small businesses getting started.'
                  : index === 1
                  ? 'For growing businesses that need more power and fewer limits.'
                  : 'For high-volume operations needing custom solutions.'

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl p-7 transition-all ${
                      isRecommended
                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/25 ring-0 md:scale-105 md:z-10'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm'
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${isRecommended ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1.5 mt-3">
                        <span className={`text-4xl sm:text-5xl font-black tracking-tighter ${isRecommended ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                          {priceLabel}
                        </span>
                        {plan.monthlyPrice > 0 && (
                          <span className={`text-sm font-medium ${isRecommended ? 'text-blue-200' : 'text-zinc-400'}`}>/mo</span>
                        )}
                      </div>
                      <p className={`text-sm mt-3 leading-relaxed ${isRecommended ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {planDesc}
                      </p>
                    </div>

                    <div className={`w-full h-px mb-6 ${isRecommended ? 'bg-blue-500' : 'bg-zinc-100 dark:bg-zinc-800'}`} />

                    <ul className="space-y-3.5 mb-8 flex-1">
                      {[
                        plan.userLimits === null ? 'Unlimited Users' : `Up to ${plan.userLimits} Users`,
                        plan.clientLimits === null ? 'Unlimited Clients' : `Up to ${plan.clientLimits} Clients`,
                        plan.invoiceLimits === null ? 'Unlimited Invoices' : `Up to ${plan.invoiceLimits} Invoices`,
                        plan.name.toLowerCase() === 'free' ? 'PDF with Watermark' : 'No Watermark on PDFs',
                        'GST-ready invoicing',
                        'Multi-currency support',
                      ].map(feat => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isRecommended ? 'text-blue-200' : 'text-blue-500'}`} />
                          <span className={`text-sm ${isRecommended ? 'text-blue-50' : 'text-zinc-700 dark:text-zinc-300'}`}>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={isCustom ? '/contact' : '/sign-up'}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-center text-sm transition-all ${
                        isRecommended
                          ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-md'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {plan.monthlyPrice === 0 && !isCustom ? 'Start Free' : isCustom ? 'Contact Sales' : 'Get Started'}
                    </Link>
                  </div>
                )
              })}
            </div>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-8">
              All plans include GST invoicing, multi-currency support, and PDF download. Upgrade or cancel anytime.
            </p>
          </div>
        </section>

        {/* ── TRUST QUOTE ──────────────────────────────────────────────── */}
        <section className="w-full py-20 sm:py-28 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <TrendingUp className="w-10 h-10 text-blue-500 mx-auto mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed mb-6">
              "Designed for businesses that want simpler, more organized invoicing — without the learning curve."
            </blockquote>
            <Link
              href={signupHref}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Try it free today <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="w-full py-24 sm:py-32 bg-zinc-50 dark:bg-[#0d0d0f] border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Frequently Asked Questions</h2>
            </div>
            <MarketingFAQ />
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="w-full py-24 sm:py-32 relative overflow-hidden">
          {/* Rich gradient background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
          <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 to-transparent" />

          <div className="max-w-3xl mx-auto px-6 text-center text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-6">Get Started Today</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.05]">
              Ready to Simplify<br />Your Invoicing?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Spend less time managing invoices and more time running your business. Start for free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-base hover:bg-blue-50 transition-all hover:shadow-xl hover:-translate-y-0.5 shadow-lg"
              >
                Start Free
                <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="bg-blue-800/60 border border-blue-500/40 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-blue-800 transition-all backdrop-blur-sm"
              >
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
