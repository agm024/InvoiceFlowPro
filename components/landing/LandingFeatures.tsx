'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { motion as m } from 'framer-motion'

// ─── Feature 01: Invoice creation ────────────────────────────────────
function FeatureInvoice() {
  return (
    <motion.section
      id="features"
      className="w-full py-24 md:py-36"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      style={{ background: '#F7F6F2' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — The Invoice Document */}
        <div className="relative order-2 lg:order-1">
          <div
            className="land-invoice-card p-6"
            style={{ maxWidth: 420 }}
          >
            {/* Invoice header */}
            <div className="flex justify-between mb-5">
              <div>
                <div className="font-black text-lg" style={{ color: '#151515' }}>INV-1042</div>
                <div className="text-[11px] mt-0.5" style={{ color: '#6B6B67' }}>10 Sep 2026 · Due 25 Sep</div>
              </div>
              <span className="land-badge-paid self-start">Paid</span>
            </div>

            {/* Line items */}
            <div className="mb-4">
              {[
                { d: 'Freight Services (Mumbai–Delhi)', a: '₹28,000' },
                { d: 'Loading & Unloading Charges',    a: '₹8,500' },
                { d: 'Documentation & E-Way Bill',     a: '₹2,000' },
              ].map((item, i) => (
                <motion.div
                  key={item.d}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="flex justify-between py-2.5 text-sm"
                  style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}
                >
                  <span style={{ color: '#151515' }}>{item.d}</span>
                  <span className="land-mono font-bold" style={{ color: '#151515' }}>{item.a}</span>
                </motion.div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between" style={{ color: '#6B6B67' }}>
                <span>Subtotal</span><span className="land-mono">₹38,500</span>
              </div>
              <div className="flex justify-between" style={{ color: '#6B6B67' }}>
                <span>GST @18%</span><span className="land-mono">₹6,930</span>
              </div>
              <div className="flex justify-between font-black text-base pt-2 mt-1" style={{ color: '#151515', borderTop: '1px solid rgba(21,21,21,0.12)' }}>
                <span>Total</span>
                <span className="land-mono" style={{ color: '#20B26B' }}>₹45,430</span>
              </div>
            </div>
          </div>

          {/* PDF badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-4 right-0 land-invoice-card px-4 py-2.5 flex items-center gap-2 text-xs font-semibold"
            style={{ color: '#6B6B67' }}
          >
            <span style={{ fontSize: 16 }}>📄</span> PDF ready to download
          </motion.div>
        </div>

        {/* Right — Copy */}
        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="land-label mb-5">01 — Invoicing</div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#151515', letterSpacing: '-0.03em' }}>
            Invoices that look<br />like your business.
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B6B67' }}>
            Create professional, GST-compliant invoices in seconds. Add your line items, apply tax, and generate a clean PDF — all without starting from scratch every time.
          </p>
          <div className="space-y-3">
            {[
              'GST-compliant with CGST, SGST & IGST',
              'Professional PDF download — no watermark on paid plans',
              'Save item templates for repeat invoices',
              'Estimates that convert to invoices in one click',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm" style={{ color: '#6B6B67' }}>
                <span style={{ color: '#20B26B', fontWeight: 700 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ─── Feature 02: Payment Tracking ────────────────────────────────────
function FeatureTracking() {
  const steps = ['Created', 'Sent', 'Viewed', 'Paid']
  const [activeStep, setActiveStep] = useState(3)

  return (
    <section
      className="w-full py-24 md:py-36"
      style={{ background: '#111111', color: '#E8E8E4' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[10px] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#20B26B' }}>
            02 — Payment Tracking
          </div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}>
            Know what&apos;s paid.<br />Before you ask.
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B6B67' }}>
            Your dashboard shows every invoice&apos;s status in real-time — paid, pending, or overdue. No more chasing payments or guessing who owes what.
          </p>
          {/* KPI deltas */}
          <div className="flex gap-6">
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase mb-1" style={{ color: '#6B6B67' }}>Pending</div>
              <div className="font-black text-xl land-mono" style={{ color: '#E45D5D' }}>₹42,800</div>
              <div className="text-xs mt-0.5" style={{ color: '#6B6B67' }}>→ <span style={{ color: '#20B26B' }}>₹0</span> after payment</div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase mb-1" style={{ color: '#6B6B67' }}>Paid</div>
              <div className="font-black text-xl land-mono" style={{ color: '#20B26B' }}>₹32,100</div>
              <div className="text-xs mt-0.5" style={{ color: '#6B6B67' }}>→ <span style={{ color: '#20B26B' }}>₹74,900</span> after payment</div>
            </div>
          </div>
        </motion.div>

        {/* Right — Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="land-mono text-xs mb-1" style={{ color: '#6B6B67' }}>INV-1048</div>
          <div className="font-black text-2xl land-mono mb-1" style={{ color: '#E8E8E4' }}>₹42,800</div>
          <div className="text-xs mb-6" style={{ color: '#6B6B67' }}>Reliance Transport Ltd.</div>

          {/* Progress steps */}
          <div className="flex items-center gap-0 mb-8">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveStep(i)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: i <= activeStep ? '#20B26B' : 'rgba(255,255,255,0.08)',
                      color: i <= activeStep ? '#fff' : '#6B6B67',
                    }}
                  >
                    {i <= activeStep ? '✓' : i + 1}
                  </button>
                  <span className="text-[9px] font-semibold mt-1.5 text-center" style={{ color: i <= activeStep ? '#E8E8E4' : '#6B6B67' }}>
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 h-px mx-1 mb-4 transition-all duration-500"
                    style={{ background: i < activeStep ? '#20B26B' : 'rgba(255,255,255,0.08)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Current status */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(32, 178, 107, 0.10)', border: '1px solid rgba(32,178,107,0.2)' }}>
            <div className="text-sm font-bold" style={{ color: '#20B26B' }}>
              {activeStep === 3 ? '✓ Payment confirmed' : activeStep === 2 ? '👁 Invoice viewed' : activeStep === 1 ? '📤 Invoice sent' : '📝 Invoice created'}
            </div>
            <div className="text-xs mt-1" style={{ color: '#6B6B67' }}>
              {activeStep === 3 ? 'Dashboard updated · Balance cleared' : 'Click the steps to see the journey'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Feature 03: Global Currencies ───────────────────────────────────
const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee',   amount: 45430,  formatted: '₹45,430' },
  { code: 'USD', symbol: '$', name: 'US Dollar',       amount: 543,    formatted: '$543.00' },
  { code: 'EUR', symbol: '€', name: 'Euro',            amount: 498,    formatted: '€498.00' },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling',  amount: 428,    formatted: '£428.00' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen',    amount: 81200,  formatted: '¥81,200' },
]

function FeatureCurrency() {
  const [selected, setSelected] = useState(0)
  const curr = CURRENCIES[selected]

  return (
    <section
      className="w-full py-24 md:py-36"
      style={{ background: '#FAFAF7' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Currency Selector */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="land-label mb-5">03 — Global Currencies</div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#151515', letterSpacing: '-0.03em' }}>
            One billing system.<br />Every market.
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B6B67' }}>
            Bill domestic and international clients in their local currency. Exchange rates are tracked at the time of invoice creation, keeping your records accurate.
          </p>

          {/* Currency buttons */}
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map((c, i) => (
              <button
                key={c.code}
                onClick={() => setSelected(i)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: selected === i ? '#151515' : 'rgba(21,21,21,0.06)',
                  color: selected === i ? '#fff' : '#151515',
                  border: '1px solid ' + (selected === i ? '#151515' : 'transparent'),
                }}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right — Invoice preview updating */}
        <div className="flex flex-col gap-4">
          <div
            className="land-invoice-card p-5"
          >
            <div className="flex justify-between mb-4">
              <div className="font-black text-base" style={{ color: '#151515' }}>INV-1043</div>
              <span className="land-badge-sent">Sent</span>
            </div>
            <div className="text-xs mb-3" style={{ color: '#6B6B67' }}>Dubai Cargo Solutions LLC · {curr.code}</div>

            <div className="py-2.5 flex justify-between text-sm" style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}>
              <span style={{ color: '#151515' }}>Freight Services</span>
              <span className="land-mono font-bold" style={{ color: '#151515' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={curr.code + '-item'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {curr.symbol}{(curr.amount * 0.62).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div className="flex justify-between font-black text-base pt-3 mt-1" style={{ color: '#151515' }}>
              <span>Total</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={curr.code}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="land-mono"
                  style={{ color: '#20B26B' }}
                >
                  {curr.formatted}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div
            className="rounded-xl p-4 text-xs"
            style={{ background: 'rgba(21,21,21,0.04)', border: '1px solid rgba(21,21,21,0.08)' }}
          >
            <span style={{ color: '#9B9B96' }}>Selected currency: </span>
            <span className="font-bold" style={{ color: '#151515' }}>{curr.name} ({curr.code})</span>
            <span style={{ color: '#9B9B96' }}> · Rate locked at invoice creation</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Feature 04: Customers ────────────────────────────────────────────
function FeatureCustomers() {
  return (
    <section
      className="w-full py-24 md:py-36"
      style={{ background: '#F7F6F2', borderTop: '1px solid rgba(21,21,21,0.06)' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="land-label mb-5">04 — Customers</div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#151515', letterSpacing: '-0.03em' }}>
            Your clients,<br />finally organized.
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B6B67' }}>
            Every customer has a complete profile — billing address, invoice history, outstanding balance, and preferred currency. You always know where things stand.
          </p>
          <div className="space-y-3">
            {[
              'Complete billing history per customer',
              'Track outstanding balance at a glance',
              'GSTIN and contact details stored once',
              'Reuse customer info on every new invoice',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm" style={{ color: '#6B6B67' }}>
                <span style={{ color: '#20B26B', fontWeight: 700 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="land-invoice-card p-6"
        >
          <div className="flex items-start gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(21,21,21,0.08)' }}>
            <div className="w-12 h-12 rounded-xl font-black text-lg flex items-center justify-center" style={{ background: '#151515', color: '#20B26B' }}>
              A
            </div>
            <div>
              <div className="font-black" style={{ color: '#151515' }}>Apex Distribution Pvt. Ltd.</div>
              <div className="text-xs mt-0.5" style={{ color: '#6B6B67' }}>Mumbai, Maharashtra</div>
              <div className="text-[10px] land-mono mt-0.5" style={{ color: '#9B9B96' }}>GSTIN: 27AABCA1234A1Z5</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Total Revenue', value: '₹3,21,000', color: '#20B26B' },
              { label: 'Outstanding',   value: '₹45,430',   color: '#E8A93A' },
              { label: 'Total Invoices', value: '14',        color: '#151515' },
              { label: 'Last Payment',  value: '10 Sep',     color: '#151515' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: '#9B9B96' }}>{s.label}</div>
                <div className="font-black text-lg land-mono" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: '#9B9B96' }}>Recent Invoices</div>
          {['INV-1042 · ₹45,430 · Paid', 'INV-1038 · ₹32,000 · Paid', 'INV-1031 · ₹28,000 · Pending'].map(line => (
            <div key={line} className="text-xs py-2" style={{ borderBottom: '1px solid rgba(21,21,21,0.05)', color: '#6B6B67' }}>
              {line}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Feature 05: Team ─────────────────────────────────────────────────
function FeatureTeam() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    { name: 'Admin',    perms: ['Create invoices', 'Manage team', 'Edit settings', 'View all data', 'Manage billing'], color: '#151515' },
    { name: 'Finance',  perms: ['Create invoices', 'View all data', 'Download PDFs'],                                  color: '#20B26B' },
    { name: 'Manager',  perms: ['Create invoices', 'View own invoices'],                                               color: '#3B82F6' },
    { name: 'Staff',    perms: ['Create invoices'],                                                                    color: '#9B9B96' },
  ]

  const allPerms = ['Create invoices', 'Manage team', 'Edit settings', 'View all data', 'Manage billing', 'Download PDFs', 'View own invoices']

  return (
    <section
      className="w-full py-24 md:py-36"
      style={{ background: '#111111', color: '#E8E8E4' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Permissions grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[360px]">
            {/* Role header */}
            <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: '1fr repeat(4, 52px)' }}>
              <span />
              {roles.map(r => (
                <button
                  key={r.name}
                  className="text-[10px] font-black text-center rounded-lg py-2 px-1 transition-all"
                  style={{
                    color: hoveredRole === r.name ? '#fff' : r.color,
                    background: hoveredRole === r.name ? r.color : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${r.color}30`,
                  }}
                  onMouseEnter={() => setHoveredRole(r.name)}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  {r.name}
                </button>
              ))}
            </div>
            {/* Permission rows */}
            {allPerms.map(perm => (
              <div
                key={perm}
                className="grid gap-2 py-2.5 items-center"
                style={{ gridTemplateColumns: '1fr repeat(4, 52px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-xs" style={{ color: '#9B9B96' }}>{perm}</span>
                {roles.map(r => {
                  const has = r.perms.includes(perm)
                  return (
                    <div key={r.name} className="flex justify-center">
                      <span
                        className="text-sm transition-all"
                        style={{
                          color: has ? (hoveredRole === r.name ? r.color : '#20B26B') : 'rgba(255,255,255,0.12)',
                          opacity: hoveredRole && hoveredRole !== r.name ? 0.4 : 1,
                        }}
                      >
                        {has ? '✓' : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="text-[10px] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#20B26B' }}>
            05 — Team Management
          </div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}>
            Give people access.<br />Not everything.
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B6B67' }}>
            Invite your team with role-based permissions. Finance sees billing. Staff creates invoices. Admins manage everything. You stay in control.
          </p>
          <div className="space-y-3">
            {[
              'Invite unlimited team members on paid plans',
              'Four role levels: Admin, Finance, Manager, Staff',
              'Permissions controlled per role',
              'Revoke access instantly',
            ].map(f => (
              <div key={f} className="flex items-start gap-3 text-sm" style={{ color: '#6B6B67' }}>
                <span style={{ color: '#20B26B', fontWeight: 700 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Feature 06: Security ─────────────────────────────────────────────
function SecurityNode({ x, y, active }: { x: string; y: string; active?: boolean }) {
  return (
    <motion.circle
      cx={x} cy={y} r="5"
      fill={active ? '#20B26B' : '#2a2a2a'}
      stroke={active ? '#20B26B' : '#333'}
      strokeWidth="1.5"
      animate={active ? { opacity: [1, 0.5, 1], r: [5, 7, 5] } : {}}
      transition={active ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  )
}

function FeatureSecurity() {
  return (
    <section
      className="w-full py-24 md:py-36"
      style={{ background: '#080808', color: '#E8E8E4', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[10px] font-bold tracking-[0.18em] uppercase mb-5" style={{ color: '#20B26B' }}>
            06 — Security
          </div>
          <h2 className="font-black tracking-tighter mb-6 leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}>
            Your numbers deserve<br />serious protection.
          </h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#6B6B67' }}>
            Your billing data is encrypted in transit and at rest. Role-based access ensures each team member only sees what they need to see.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🔐', title: '256-bit encryption', desc: 'AES-256 at rest and in transit' },
              { icon: '☁️', title: 'Cloud infrastructure', desc: 'Reliable, distributed storage' },
              { icon: '🔑', title: 'Controlled access', desc: 'Role-based permissions' },
              { icon: '🛡️', title: 'Secure auth', desc: 'Protected login with session management' },
            ].map(item => (
              <div
                key={item.title}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold mb-0.5">{item.title}</div>
                <div className="text-[11px]" style={{ color: '#6B6B67' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Abstract security visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="hidden lg:block"
        >
          <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
            {/* Grid lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320"
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {/* Connection lines */}
            <motion.path
              d="M 200 160 L 80 80 L 120 200 L 320 80 L 280 240 L 200 160"
              stroke="#20B26B" strokeWidth="1" fill="none" opacity="0.3"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 200 160 L 360 200 L 300 40 L 100 280 L 200 160"
              stroke="#20B26B" strokeWidth="0.5" fill="none" opacity="0.2"
              strokeDasharray="1000"
              initial={{ strokeDashoffset: 1000 }}
              whileInView={{ strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
            />
            {/* Nodes */}
            <SecurityNode x="200" y="160" active />
            <SecurityNode x="80" y="80" />
            <SecurityNode x="120" y="200" />
            <SecurityNode x="320" y="80" />
            <SecurityNode x="280" y="240" />
            <SecurityNode x="360" y="200" />
            <SecurityNode x="300" y="40" />
            <SecurityNode x="100" y="280" />
            {/* Center lock icon */}
            <text x="192" y="165" fontSize="18" fill="#20B26B" textAnchor="middle">🔐</text>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  return (
    <>
      <FeatureInvoice />
      <FeatureTracking />
      <FeatureCurrency />
      <FeatureCustomers />
      <FeatureTeam />
      <FeatureSecurity />
    </>
  )
}
