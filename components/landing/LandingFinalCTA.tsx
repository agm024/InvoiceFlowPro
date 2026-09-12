'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function LandingFinalCTA({ signupHref }: { signupHref: string }) {
  return (
    <section
      className="relative w-full py-36 md:py-48 overflow-hidden"
      style={{ background: '#111111', color: '#E8E8E4' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating invoice card — decorative */}
      <motion.div
        className="absolute right-12 top-16 hidden lg:block pointer-events-none select-none"
        animate={{ y: [0, -12, 0], rotate: [2, 4, 2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity: 0.12 }}
      >
        <div
          className="rounded-2xl p-6 w-64"
          style={{
            background: '#fff',
            border: '1px solid rgba(21,21,21,0.12)',
          }}
        >
          <div className="font-black text-lg mb-1" style={{ color: '#151515' }}>INV-1042</div>
          <div className="text-xs mb-4" style={{ color: '#6B6B67' }}>Apex Distribution Pvt. Ltd.</div>
          <div className="flex justify-between text-sm font-black" style={{ color: '#151515' }}>
            <span>Total</span>
            <span style={{ color: '#20B26B' }}>₹45,430</span>
          </div>
          <div className="mt-3 land-badge-paid inline-block">PAID</div>
        </div>
      </motion.div>

      {/* Second floating card */}
      <motion.div
        className="absolute left-8 bottom-20 hidden xl:block pointer-events-none select-none"
        animate={{ y: [0, 10, 0], rotate: [-3, -1, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ opacity: 0.08 }}
      >
        <div
          className="rounded-xl p-4 w-48"
          style={{ background: '#fff', border: '1px solid rgba(21,21,21,0.12)' }}
        >
          <div className="text-[10px] font-bold mb-2" style={{ color: '#9B9B96' }}>PAYMENT RECEIVED</div>
          <div className="font-black text-xl land-mono" style={{ color: '#20B26B' }}>₹45,430</div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase mb-8" style={{ color: '#20B26B' }}>
            Get started today
          </div>

          <h2
            className="font-black tracking-tighter mb-8 leading-[1.0]"
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 5.6rem)',
              letterSpacing: '-0.04em',
            }}
          >
            Stop chasing invoices.<br />
            <span style={{ color: '#20B26B' }}>Start running</span><br />
            your business.
          </h2>

          <p
            className="text-lg mb-12 leading-relaxed mx-auto"
            style={{ color: '#9B9B96', maxWidth: 480 }}
          >
            Everything you need to create, manage and track invoices — in one beautifully simple workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={signupHref}
              className="group inline-flex items-center gap-2 font-bold rounded-xl transition-all hover:-translate-y-0.5"
              style={{
                background: '#20B26B',
                color: '#fff',
                padding: '14px 32px',
                fontSize: 15,
                boxShadow: '0 8px 32px rgba(32, 178, 107, 0.3)',
              }}
            >
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#9B9B96',
                padding: '14px 28px',
                fontSize: 15,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Open FlowRadiant
            </Link>
          </div>

          <p className="mt-8 text-sm" style={{ color: '#9B9B96' }}>
            No credit card required · Unlimited invoices on free plan · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
