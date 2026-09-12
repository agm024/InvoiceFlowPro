'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, Minus } from 'lucide-react'

type Plan = {
  id: string
  name: string
  monthlyPrice: number
  userLimits: number | null
  clientLimits: number | null
  invoiceLimits: number | null
}

function fmt(n: number) {
  return n.toLocaleString('en-IN')
}

export function LandingPricing({ plans }: { plans: Plan[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const descriptions: Record<string, string> = {
    Free: 'Try FlowRadiant at no cost. Everything you need to start invoicing.',
    Pro:  'For growing businesses that need professional, watermark-free output.',
    Max:  'No limits. Designed for high-volume billing operations.',
  }

  const getFeatures = (plan: Plan) => [
    {
      label: plan.userLimits === null ? 'Unlimited Users' : `Up to ${plan.userLimits} Users`,
      available: true,
    },
    {
      label: plan.clientLimits === null ? 'Unlimited Clients' : `Up to ${plan.clientLimits} Clients`,
      available: true,
    },
    {
      label: plan.invoiceLimits === null ? 'Unlimited Invoices' : `Up to ${plan.invoiceLimits} Invoices`,
      available: true,
    },
    {
      label: plan.name.toLowerCase() === 'free' ? 'PDF with Watermark' : 'PDF — No Watermark',
      available: true,
    },
    { label: 'GST-ready invoicing',         available: true },
    { label: 'Multi-currency billing',       available: true },
    { label: 'Real-time payment tracking',   available: true },
    { label: 'Role-based team access',       available: plan.name.toLowerCase() !== 'free' },
  ]

  const displayedPlans = plans.slice(0, 3)

  return (
    <section id="pricing" className="w-full py-24 md:py-36" style={{ background: '#F7F6F2' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <div className="land-label mb-4">Pricing</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2
              className="font-black tracking-tighter leading-[1.05]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: '#151515', letterSpacing: '-0.03em', maxWidth: 600 }}
            >
              Simple, transparent pricing.
            </h2>
            <p className="text-sm" style={{ color: '#6B6B67', maxWidth: 240 }}>
              Start free. Upgrade as your business grows. No hidden fees.
            </p>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayedPlans.map((plan, index) => {
            const isRecommended = plan.name.toLowerCase() === 'pro'
            const isActive = hovered === plan.id || (hovered === null && isRecommended)
            const features = getFeatures(plan)

            return (
              <motion.div
                key={plan.id}
                onHoverStart={() => setHovered(plan.id)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex flex-col rounded-2xl p-7 cursor-default"
                style={{
                  background: isRecommended ? '#151515' : '#fff',
                  border: isRecommended
                    ? '1px solid #151515'
                    : `1px solid ${isActive ? 'rgba(21,21,21,0.28)' : 'rgba(21,21,21,0.10)'}`,
                  boxShadow: isRecommended ? '0 12px 48px rgba(21,21,21,0.18)' : isActive ? '0 4px 20px rgba(21,21,21,0.08)' : 'none',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
              >
                {isRecommended && (
                  <div
                    className="absolute -top-3 left-6 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ background: '#20B26B', color: '#fff' }}
                  >
                    Recommended
                  </div>
                )}

                {/* Plan name + desc */}
                <div className="mb-6">
                  <div
                    className="text-[10px] font-black uppercase tracking-widest mb-3"
                    style={{ color: isRecommended ? '#9B9B96' : '#9B9B96' }}
                  >
                    {plan.name}
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span
                      className="font-black land-mono"
                      style={{
                        fontSize: 'clamp(2.4rem, 4vw, 3rem)',
                        color: isRecommended ? '#fff' : '#151515',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {plan.monthlyPrice === 0 ? '₹0' : `₹${fmt(plan.monthlyPrice)}`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-sm font-medium" style={{ color: isRecommended ? '#6B6B67' : '#9B9B96' }}>
                        /mo
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: isRecommended ? '#9B9B96' : '#6B6B67' }}>
                    {descriptions[plan.name] ?? `${plan.name} plan`}
                  </p>
                </div>

                <div className="w-full h-px mb-6" style={{ background: isRecommended ? 'rgba(255,255,255,0.08)' : 'rgba(21,21,21,0.08)' }} />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f.label} className="flex items-start gap-2.5">
                      {f.available ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 mt-0.5"
                          style={{ color: isRecommended ? '#20B26B' : '#20B26B' }}
                        />
                      ) : (
                        <Minus
                          size={14}
                          className="shrink-0 mt-0.5"
                          style={{ color: isRecommended ? '#6B6B67' : '#d4d4d4' }}
                        />
                      )}
                      <span
                        className="text-sm"
                        style={{
                          color: f.available
                            ? (isRecommended ? '#E8E8E4' : '#151515')
                            : (isRecommended ? '#6B6B67' : '#b0b0b0'),
                          fontWeight: 500,
                        }}
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/sign-up"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all"
                  style={{
                    background: isRecommended ? '#20B26B' : 'rgba(21,21,21,0.08)',
                    color: isRecommended ? '#fff' : '#151515',
                    border: isRecommended ? 'none' : '1px solid rgba(21,21,21,0.12)',
                  }}
                >
                  {plan.monthlyPrice === 0 ? 'Start for free' : 'Get started'} →
                </Link>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-[11px] mt-8" style={{ color: '#9B9B96' }}>
          All plans include GST invoicing, multi-currency support, and PDF download. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
