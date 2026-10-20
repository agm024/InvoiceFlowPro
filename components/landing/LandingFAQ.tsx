'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { HOME_FAQS, FAQItem } from './faqData'

export { HOME_FAQS }
export type { FAQItem }

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="w-full py-24 md:py-32" style={{ background: '#F7F6F2', borderTop: '1px solid rgba(21,21,21,0.08)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="land-label mb-3">FAQ</div>
          <h2
            className="font-black tracking-tighter leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#151515', letterSpacing: '-0.03em' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6B6B67' }}>
            Everything you need to know about FlowRadiantPro by SiteRadiant, GST compliance, and billing management.
          </p>
        </div>

        <div className="space-y-4">
          {HOME_FAQS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={item.q}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: '#FFFFFF',
                  border: isOpen ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(21, 21, 21, 0.08)',
                  boxShadow: isOpen ? '0 8px 24px -8px rgba(6, 182, 212, 0.12)' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base md:text-lg transition-colors"
                  style={{ color: '#151515' }}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 transition-transform duration-300"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isOpen ? '#06B6D4' : '#6B6B67'
                    }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div
                        className="px-6 pb-6 text-sm md:text-base leading-relaxed"
                        style={{ color: '#6B6B67', borderTop: '1px solid rgba(21,21,21,0.04)', paddingTop: '16px' }}
                      >
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
