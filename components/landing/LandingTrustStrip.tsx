'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return { ref, count }
}

const stats = [
  {
    value: null,
    label: 'Unlimited invoices',
    display: '∞',
    sub: 'Create as many invoices as your business needs.',
  },
  {
    value: null,
    label: 'Global currencies',
    display: '30+',
    sub: 'Bill customers wherever they are in the world.',
  },
  {
    value: null,
    label: 'Real-time tracking',
    display: '100%',
    sub: 'Know what is paid, pending or overdue instantly.',
  },
  {
    value: 256,
    label: 'Bit encryption',
    display: null,
    sub: 'Your financial data stays protected at all times.',
  },
]

export function LandingTrustStrip() {
  const c = useCounter(256)

  return (
    <section
      className="w-full"
      style={{ borderTop: '1px solid rgba(21,21,21,0.08)', borderBottom: '1px solid rgba(21,21,21,0.08)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p
          className="text-center text-[11px] font-bold tracking-[0.22em] uppercase mb-12"
          style={{ color: '#9B9B96' }}
        >
          Built for businesses that hate billing busywork
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col">
              <div
                className="font-black land-mono mb-1"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  color: '#151515',
                  letterSpacing: '-0.04em',
                }}
              >
                {s.value !== null ? (
                  <>
                    <span ref={i === 3 ? c.ref : undefined}>
                      {i === 3 ? c.count : s.value}
                    </span>
                    <span style={{ fontSize: '60%', color: '#20B26B' }}>-bit</span>
                  </>
                ) : (
                  <span style={{ color: i === 0 ? '#20B26B' : '#151515' }}>{s.display}</span>
                )}
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#151515' }}>{s.label}</div>
              <div className="text-[12px] leading-relaxed" style={{ color: '#6B6B67' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
