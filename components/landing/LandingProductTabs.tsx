'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'overview' | 'invoices' | 'customers' | 'payments' | 'team'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'invoices',   label: 'Invoices'   },
  { id: 'customers',  label: 'Customers'  },
  { id: 'payments',   label: 'Payments'   },
  { id: 'team',       label: 'Team'       },
]

function OverviewPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Revenue',  value: '₹45,231', color: '#151515' },
          { label: 'Paid',     value: '₹32,100', color: '#20B26B' },
          { label: 'Pending',  value: '₹10,400', color: '#E8A93A' },
          { label: 'Overdue',  value: '₹2,731',  color: '#E45D5D' },
        ].map(k => (
          <div
            key={k.label}
            className="rounded-xl p-4"
            style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.08)' }}
          >
            <div className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#6B6B67' }}>{k.label}</div>
            <div className="font-black text-xl land-mono" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      {/* Graph placeholder — elegant bars */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.08)' }}
      >
        <div className="text-[11px] font-bold mb-4" style={{ color: '#6B6B67' }}>REVENUE — LAST 7 DAYS</div>
        <div className="flex items-end gap-2 h-20">
          {[45, 72, 38, 91, 55, 84, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded-md transition-all" style={{ height: `${h}%`, background: i === 6 ? '#20B26B' : '#151515', opacity: i === 6 ? 1 : 0.08 + i * 0.1 }} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[9px] font-semibold" style={{ color: '#9B9B96' }}>{d}</span>
          ))}
        </div>
      </div>
      {/* Recent invoices mini list */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(21,21,21,0.08)', background: '#fff' }}>
        <div className="px-5 py-3 flex justify-between" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}>
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#6B6B67' }}>Recent</span>
          <span className="text-[10px] font-bold" style={{ color: '#20B26B' }}>View all →</span>
        </div>
        {[
          { no: 'INV-1042', client: 'Apex Distribution', amount: '₹45,430', status: 'paid' },
          { no: 'INV-1041', client: 'Global Freight Co.', amount: '₹28,000', status: 'sent' },
          { no: 'INV-1040', client: 'North Star Logistics', amount: '₹12,500', status: 'pending' },
        ].map(row => (
          <div key={row.no} className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(21,21,21,0.04)' }}>
            <div>
              <div className="font-semibold text-xs" style={{ color: '#151515' }}>{row.client}</div>
              <div className="text-[10px] land-mono" style={{ color: '#9B9B96' }}>{row.no}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-sm land-mono" style={{ color: '#151515' }}>{row.amount}</span>
              <span className={`land-badge-${row.status}`}>{row.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvoicesPanel() {
  const invoices = [
    { no: 'INV-1042', client: 'Apex Distribution Pvt. Ltd.',    amount: '₹45,430',  date: '10 Sep',  status: 'paid' },
    { no: 'INV-1041', client: 'Global Freight Co.',              amount: '₹28,000',  date: '08 Sep',  status: 'sent' },
    { no: 'INV-1040', client: 'North Star Logistics',            amount: '₹12,500',  date: '05 Sep',  status: 'pending' },
    { no: 'INV-1039', client: 'Reliance Transport Ltd.',         amount: '₹82,000',  date: '01 Sep',  status: 'paid' },
    { no: 'INV-1038', client: 'Mumbai Port Authority',           amount: '₹34,200',  date: '28 Aug',  status: 'paid' },
  ]
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.08)' }}>
      <div className="grid grid-cols-5 px-5 py-3 text-[10px] font-bold tracking-widest uppercase" style={{ color: '#9B9B96', borderBottom: '1px solid rgba(21,21,21,0.08)', background: '#FAFAF8' }}>
        <span>Invoice</span>
        <span className="col-span-2">Client</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Status</span>
      </div>
      {invoices.map(inv => (
        <div key={inv.no} className="grid grid-cols-5 items-center px-5 py-3" style={{ borderBottom: '1px solid rgba(21,21,21,0.04)' }}>
          <span className="land-mono text-[11px] font-bold" style={{ color: '#151515' }}>{inv.no}</span>
          <span className="col-span-2 text-xs font-medium truncate pr-2" style={{ color: '#151515' }}>{inv.client}</span>
          <span className="text-right land-mono text-xs font-bold" style={{ color: '#151515' }}>{inv.amount}</span>
          <span className="text-right"><span className={`land-badge-${inv.status}`}>{inv.status}</span></span>
        </div>
      ))}
    </div>
  )
}

function CustomersPanel() {
  const customers = [
    { name: 'Apex Distribution Pvt. Ltd.',  invoices: 14, revenue: '₹3,21,000',  outstanding: '₹45,430',  currency: 'INR' },
    { name: 'Global Freight Co.',           invoices:  8, revenue: '₹1,84,000',  outstanding: '₹28,000',  currency: 'INR' },
    { name: 'North Star Logistics',         invoices: 22, revenue: '₹2,48,500',  outstanding: '₹0',       currency: 'INR' },
    { name: 'Dubai Cargo Solutions LLC',    invoices:  5, revenue: '$24,800',     outstanding: '$0',        currency: 'USD' },
  ]
  return (
    <div className="space-y-2">
      {customers.map(c => (
        <div
          key={c.name}
          className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.08)' }}
        >
          <div>
            <div className="font-bold text-sm" style={{ color: '#151515' }}>{c.name}</div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9B9B96' }}>{c.invoices} invoices · {c.currency}</div>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <div className="text-[10px] font-bold tracking-wider uppercase mb-0.5" style={{ color: '#9B9B96' }}>Revenue</div>
              <div className="font-black text-sm land-mono" style={{ color: '#20B26B' }}>{c.revenue}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold tracking-wider uppercase mb-0.5" style={{ color: '#9B9B96' }}>Outstanding</div>
              <div className="font-black text-sm land-mono" style={{ color: c.outstanding === '₹0' || c.outstanding === '$0' ? '#9B9B96' : '#E8A93A' }}>{c.outstanding}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PaymentsPanel() {
  const events = [
    { label: 'INV-1042 paid by Apex Distribution',   time: 'Just now',   type: 'paid' },
    { label: 'INV-1041 sent to Global Freight Co.',  time: '2h ago',     type: 'sent' },
    { label: 'INV-1039 paid by Reliance Transport',  time: 'Yesterday',  type: 'paid' },
    { label: 'INV-1038 marked overdue',              time: '3d ago',     type: 'overdue' },
    { label: 'INV-1037 paid by North Star Logistics', time: '5d ago',    type: 'paid' },
  ]
  const colorMap: Record<string, string> = { paid: '#20B26B', sent: '#3B82F6', overdue: '#E45D5D' }
  return (
    <div className="space-y-3">
      {events.map((e, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: colorMap[e.type] }} />
            {i < events.length - 1 && <div className="w-px flex-1 min-h-[24px]" style={{ background: 'rgba(21,21,21,0.10)' }} />}
          </div>
          <div className="pb-2">
            <div className="text-sm font-medium" style={{ color: '#151515' }}>{e.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9B9B96' }}>{e.time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TeamPanel() {
  const members = [
    { name: 'Agastya Mishra',   email: 'agastya@company.in',  role: 'Admin',   status: 'active' },
    { name: 'Priya Sharma',     email: 'priya@company.in',    role: 'Finance', status: 'active' },
    { name: 'Rahul Singh',      email: 'rahul@company.in',    role: 'Manager', status: 'active' },
    { name: 'Anjali Gupta',     email: 'anjali@company.in',   role: 'Staff',   status: 'inactive' },
  ]
  const roleColor: Record<string, string> = {
    Admin: '#151515', Finance: '#20B26B', Manager: '#3B82F6', Staff: '#9B9B96',
  }
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.08)' }}>
      <div className="grid grid-cols-4 px-5 py-3 text-[10px] font-bold tracking-widest uppercase" style={{ color: '#9B9B96', borderBottom: '1px solid rgba(21,21,21,0.08)', background: '#FAFAF8' }}>
        <span className="col-span-2">Member</span>
        <span>Role</span>
        <span className="text-right">Access</span>
      </div>
      {members.map(m => (
        <div key={m.name} className="grid grid-cols-4 items-center px-5 py-3.5" style={{ borderBottom: '1px solid rgba(21,21,21,0.04)' }}>
          <div className="col-span-2">
            <div className="text-xs font-semibold" style={{ color: '#151515' }}>{m.name}</div>
            <div className="text-[10px]" style={{ color: '#9B9B96' }}>{m.email}</div>
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: `${roleColor[m.role]}15`,
              color: roleColor[m.role],
              width: 'fit-content',
            }}
          >
            {m.role}
          </span>
          <div className="text-right">
            <span
              className="text-[10px] font-bold"
              style={{ color: m.status === 'active' ? '#20B26B' : '#9B9B96' }}
            >
              {m.status === 'active' ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const panels: Record<Tab, React.FC> = {
  overview:  OverviewPanel,
  invoices:  InvoicesPanel,
  customers: CustomersPanel,
  payments:  PaymentsPanel,
  team:      TeamPanel,
}

export function LandingProductTabs() {
  const [active, setActive] = useState<Tab>('overview')
  const Panel = panels[active]

  return (
    <section id="product" className="w-full py-24 md:py-32" style={{ background: '#F7F6F2' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <div className="land-label mb-4">See the product</div>
          <h2
            className="font-black tracking-tighter leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: '#151515', letterSpacing: '-0.03em', maxWidth: 700 }}
          >
            Everything your billing desk needs. Nothing it doesn&apos;t.
          </h2>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-8 overflow-x-auto"
          style={{ background: 'rgba(21,21,21,0.06)', width: 'fit-content', maxWidth: '100%' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
              style={{
                color: active === tab.id ? '#151515' : '#6B6B67',
                background: active === tab.id ? '#fff' : 'transparent',
                boxShadow: active === tab.id ? '0 1px 4px rgba(21,21,21,0.10)' : 'none',
              }}
            >
              {tab.label}
              {active === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(21,21,21,0.10)', zIndex: -1 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
