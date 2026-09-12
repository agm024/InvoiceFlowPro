'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const lineItems = [
  { desc: 'Freight Services', qty: 1, amount: 28000 },
  { desc: 'Loading Charges',  qty: 1, amount:  8500 },
  { desc: 'Documentation',   qty: 1, amount:  2000 },
]

type Phase = 'idle' | 'client' | 'items' | 'totals' | 'sent' | 'paid' | 'notify'

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

function InvoiceWorkspace({ phase }: { phase: Phase }) {
  const itemsVisible = ['items','totals','sent','paid','notify'].includes(phase)
  const totalsVisible = ['totals','sent','paid','notify'].includes(phase)
  const statusLabel =
    phase === 'paid' || phase === 'notify' ? 'paid'
    : phase === 'sent' ? 'sent'
    : phase === 'idle' ? 'draft'
    : 'draft'

  const subtotal = 38500
  const gst      = 6930
  const total    = 45430

  return (
    <div
      className="land-invoice-card w-full max-w-md mx-auto select-none"
      style={{ fontSize: 13 }}
    >
      {/* Invoice header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(21,21,21,0.08)' }}>
        <div>
          <div className="land-mono text-[10px] font-bold tracking-widest" style={{ color: '#6B6B67' }}>INVOICE</div>
          <div className="font-black text-lg tracking-tight mt-0.5" style={{ color: '#151515' }}>INV-1042</div>
          <div className="text-[11px] mt-1" style={{ color: '#6B6B67' }}>
            <span>10 Sep 2026</span>
            <span className="mx-2" style={{ color: 'rgba(21,21,21,0.2)' }}>·</span>
            <span>Due 25 Sep 2026</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-black text-sm tracking-tight" style={{ color: '#151515' }}>FlowRadiant<span style={{ color: '#06B6D4' }}>Pro</span></div>
          <AnimatePresence mode="wait">
            <motion.div
              key={statusLabel}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`land-badge-${statusLabel} mt-2 inline-block`}
            >
              {statusLabel}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bill to */}
      <AnimatePresence>
        {['client','items','totals','sent','paid','notify'].includes(phase) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="px-6 py-4"
            style={{ borderBottom: '1px solid rgba(21,21,21,0.06)' }}
          >
            <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: '#6B6B67' }}>BILL TO</div>
            <div className="font-bold text-sm" style={{ color: '#151515' }}>Apex Distribution Pvt. Ltd.</div>
            <div className="text-[12px] mt-0.5" style={{ color: '#6B6B67' }}>Mumbai, Maharashtra · GSTIN 27AABCA1234A1Z5</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Line items */}
      <div className="px-6 py-3">
        <div className="grid grid-cols-3 gap-2 text-[10px] font-bold tracking-widest pb-2" style={{ color: '#6B6B67', borderBottom: '1px solid rgba(21,21,21,0.08)' }}>
          <span className="col-span-2">DESCRIPTION</span>
          <span className="text-right">AMOUNT</span>
        </div>
        <div className="space-y-0">
          {lineItems.map((item, i) => (
            <AnimatePresence key={item.desc}>
              {itemsVisible && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.3 }}
                  className="grid grid-cols-3 gap-2 py-2.5"
                  style={{ borderBottom: '1px solid rgba(21,21,21,0.05)' }}
                >
                  <span className="col-span-2 font-medium" style={{ color: '#151515' }}>{item.desc}</span>
                  <span className="text-right land-mono" style={{ color: '#151515' }}>{fmt(item.amount)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Totals */}
      <AnimatePresence>
        {totalsVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="px-6 pb-4 space-y-1.5 pt-1"
          >
            <div className="flex justify-between text-sm" style={{ color: '#6B6B67' }}>
              <span>Subtotal</span>
              <span className="land-mono">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm" style={{ color: '#6B6B67' }}>
              <span>GST @18%</span>
              <span className="land-mono">{fmt(gst)}</span>
            </div>
            <div
              className="flex justify-between pt-2 mt-2 font-black text-base"
              style={{ color: '#151515', borderTop: '1px solid rgba(21,21,21,0.10)' }}
            >
              <span>Total</span>
              <motion.span
                key="total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="land-mono"
                style={{ color: '#06B6D4' }}
              >
                {fmt(total)}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PaymentNotification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="absolute bottom-6 right-4 md:right-8"
      style={{
        background: '#151515',
        color: '#E8E8E4',
        borderRadius: 12,
        padding: '10px 16px',
        fontSize: 12,
        fontWeight: 600,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 220,
      }}
    >
      <span style={{ fontSize: 18 }}>✓</span>
      <div>
        <div style={{ color: '#06B6D4', fontWeight: 800 }}>Payment received</div>
        <div style={{ color: '#9B9B96', fontSize: 11 }}>₹45,430 · Apex Distribution</div>
      </div>
    </motion.div>
  )
}

export function LandingHero({ signupHref }: { signupHref: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => timerRef.current.forEach(clearTimeout)

  const runSequence = () => {
    clearTimers()
    const t: ReturnType<typeof setTimeout>[] = []
    t.push(setTimeout(() => setPhase('client'),  600))
    t.push(setTimeout(() => setPhase('items'),   1400))
    t.push(setTimeout(() => setPhase('totals'),  2300))
    t.push(setTimeout(() => setPhase('sent'),    3200))
    t.push(setTimeout(() => setPhase('paid'),    4400))
    t.push(setTimeout(() => setPhase('notify'),  5100))
    t.push(setTimeout(() => { setPhase('idle'); }, 8000))
    timerRef.current = t
  }

  // Loop: skip animation for prefers-reduced-motion users — show 'paid' statically
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setPhase('paid')
      return
    }
    runSequence()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Restart loop whenever idle (skipped if reduced motion)
  useEffect(() => {
    if (phase === 'idle') {
      const t = setTimeout(runSequence, 800)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <section
      aria-label="FlowRadiant hero"
      className="relative min-h-screen flex items-center pt-16"
      style={{ background: '#F7F6F2' }}
    >
      {/* Fine grid texture — decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(21,21,21,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,21,21,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start"
        >
          <div className="land-pill mb-8">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#06B6D4', animation: 'land-pulse-dot 4s ease-in-out infinite' }} />
            GST-ready invoicing for Indian businesses
          </div>

          <h1
            className="font-black tracking-tighter leading-[1.0] mb-6"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
              color: '#151515',
              letterSpacing: '-0.03em',
            }}
          >
            Your business,<br />
            billed{' '}
            <span
              style={{
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #151515 0%, #06B6D4 100%)',
              }}
            >
              beautifully.
            </span>
          </h1>

          <p
            className="text-lg leading-relaxed mb-10 max-w-lg"
            style={{ color: '#6B6B67', fontWeight: 450 }}
          >
            Create invoices, manage clients, track payments and keep your entire billing operation moving — without the spreadsheet chaos.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
            <Link href={signupHref} className="land-btn-primary group">
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#product" className="land-btn-ghost">
              Explore the product
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {['No credit card', 'Unlimited invoices on free plan', 'GST-ready'].map(t => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-[12px] font-medium"
                style={{ color: '#6B6B67' }}
              >
                <span style={{ color: '#06B6D4' }}>✓</span> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right — Animated Invoice Workspace */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Subtle shadow behind card */}
          <div
            className="absolute inset-x-8 -bottom-6 h-16 blur-xl pointer-events-none"
            style={{ background: 'rgba(21,21,21,0.08)', borderRadius: 24 }}
          />

          <div className="relative min-h-[500px] w-full flex flex-col items-center justify-start pt-4">
            <InvoiceWorkspace phase={phase} />

            <AnimatePresence>
              {phase === 'notify' && <PaymentNotification />}
            </AnimatePresence>
          </div>

          {/* Floating status indicator */}
          <motion.div
            className="absolute -top-4 -left-4 land-invoice-card px-4 py-2.5 hidden md:flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: '#06B6D4', animation: 'land-pulse-dot 4s ease-in-out infinite' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#6B6B67' }}>Live invoice preview</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, rgba(21,21,21,0.3))' }} />
      </motion.div>
    </section>
  )
}
