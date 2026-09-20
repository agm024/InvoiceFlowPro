'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, Minus } from 'lucide-react'

type Plan = {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  userLimits: number | null
  clientLimits: number | null
  invoiceLimits: number | null
  isPopular: boolean
}

function fmt(n: number) {
  return n.toLocaleString('en-IN')
}

export function LandingPricing({ plans, isLoggedIn }: { plans: Plan[], isLoggedIn?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

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
        <div className="mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="max-w-2xl">
              <div className="land-label mb-4">Pricing</div>
              <h2
                className="font-black tracking-tighter leading-[1.05] mb-4"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#151515', letterSpacing: '-0.03em' }}
              >
                Simple, transparent pricing.
              </h2>
              <p className="text-lg" style={{ color: '#6B6B67' }}>
                Start free. Upgrade as your business grows. No hidden fees.
              </p>
            </div>
            
            {/* Billing Toggle (Mobile Responsive) */}
            <div className="flex w-full md:w-auto items-center bg-zinc-200/50 border border-zinc-200/80 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 md:flex-none relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 md:flex-none relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Yearly
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black transition-colors shrink-0 ${billingCycle === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-500'}`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayedPlans.map((plan, index) => {
            const isRecommended = plan.isPopular
            const isActive = hovered === plan.id || (hovered === null && isRecommended)
            const features = getFeatures(plan)
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const cycleSuffix = isYearly ? '/yr' : '/mo';
            const priceMonthlyEquiv = isYearly && plan.yearlyPrice > 0 ? Math.floor(plan.yearlyPrice / 12) : 0;

            // Colors for light vs dark (Recommended) cards
            const textMuted = isRecommended ? '#A1A1AA' : '#71717A'; // zinc-400 : zinc-500
            const textBase = isRecommended ? '#E4E4E7' : '#18181B'; // zinc-200 : zinc-900
            const borderSoft = isRecommended ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

            // Links routing logic
            let href = '/sign-up';
            if (isLoggedIn) {
              href = plan.monthlyPrice === 0 ? '/app' : `/checkout/${plan.id}?cycle=${billingCycle}`;
            } else {
              href = plan.monthlyPrice === 0 ? '/sign-up' : `/sign-up?planId=${plan.id}&cycle=${billingCycle}`;
            }

            return (
              <motion.div
                key={plan.id}
                onHoverStart={() => setHovered(plan.id)}
                onHoverEnd={() => setHovered(null)}
                className="relative flex flex-col rounded-[2rem] p-8 md:p-10 cursor-default"
                style={{
                  background: isRecommended ? '#151515' : '#fff',
                  border: isRecommended
                    ? '1px solid #27272A' // zinc-800
                    : `1px solid ${isActive ? 'rgba(21,21,21,0.2)' : 'rgba(21,21,21,0.08)'}`,
                  boxShadow: isRecommended ? '0 20px 40px rgba(0,0,0,0.3)' : isActive ? '0 12px 32px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.3s ease',
                  transform: isActive && !isRecommended ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {isRecommended && (
                  <div
                    className="absolute -top-4 left-8 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg"
                    style={{ background: '#20B26B', color: '#fff' }}
                  >
                    Recommended
                  </div>
                )}

                {/* Plan name + desc */}
                <div className="mb-6 flex flex-col">
                  <h3
                    className="text-xs font-black uppercase tracking-widest mb-4"
                    style={{ color: textMuted }}
                  >
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className="font-black land-mono"
                      style={{
                        fontSize: 'clamp(2.5rem, 4.5vw, 3.5rem)',
                        color: isRecommended ? '#fff' : '#151515',
                        letterSpacing: '-0.04em',
                        lineHeight: '1',
                      }}
                    >
                      {price === 0 ? '₹0' : `₹${fmt(price)}`}
                    </span>
                    {price > 0 && (
                      <span className="text-base font-semibold" style={{ color: textMuted }}>
                        {cycleSuffix}
                      </span>
                    )}
                  </div>
                  
                  {/* Invisible spacer trick to prevent layout jumping while maintaining tight design */}
                  <div className={`mt-2 mb-4 flex items-start transition-opacity duration-300 ${isYearly && plan.yearlyPrice > 0 ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'}`}>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: isRecommended ? 'rgba(255,255,255,0.1)' : '#F4F4F5', color: textBase }}>
                      That's just ₹{fmt(priceMonthlyEquiv)}/mo
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed min-h-[40px]" style={{ color: textMuted }}>
                    {descriptions[plan.name] ?? `${plan.name} plan`}
                  </p>
                </div>

                <div className="w-full h-px mb-8" style={{ background: borderSoft }} />

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                  {features.map(f => (
                    <li key={f.label} className="flex items-start gap-3">
                      {f.available ? (
                        <CheckCircle2
                          size={18}
                          className="shrink-0 mt-0.5"
                          style={{ color: isRecommended ? '#34D399' : '#20B26B' }} // Emerald-400 vs Green-500
                        />
                      ) : (
                        <Minus
                          size={18}
                          className="shrink-0 mt-0.5"
                          style={{ color: isRecommended ? '#3F3F46' : '#E4E4E7' }} // zinc-700 vs zinc-200
                        />
                      )}
                      <span
                        className="text-[15px]"
                        style={{
                          color: f.available ? textBase : textMuted,
                          fontWeight: f.available ? 500 : 400,
                        }}
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={href}
                  className="w-full py-4 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-2 group"
                  style={{
                    background: isRecommended ? '#20B26B' : 'rgba(21,21,21,0.04)',
                    color: isRecommended ? '#fff' : '#151515',
                    border: isRecommended ? 'none' : '1px solid rgba(21,21,21,0.08)',
                  }}
                >
                  {plan.monthlyPrice === 0 ? 'Start for free' : 'Get started'}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
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
