'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface LandingNavProps {
  isLoggedIn: boolean
}

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '#product', label: 'Product' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(247,246,242,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(21,21,21,0.08)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#151515' }}
          >
            <span className="font-black text-sm" style={{ color: '#20B26B' }}>I</span>
          </div>
          <span className="font-black text-[15px] tracking-tight" style={{ color: '#151515' }}>
            InvoiceFlow<span style={{ color: '#20B26B' }}>Pro</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-[#6B6B67] hover:text-[#151515]"
              style={{ textDecoration: 'none' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/app" className="land-btn-primary text-sm py-2.5 px-5">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium transition-colors"
                style={{ color: '#6B6B67', textDecoration: 'none' }}
              >
                Sign in
              </Link>
              <Link href="/sign-up" className="land-btn-primary text-sm py-2.5 px-5">
                Start free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setOpen(!open)}
          style={{ color: '#151515' }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden px-6 pb-6 flex flex-col gap-1"
          style={{
            background: 'rgba(247,246,242,0.96)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(21,21,21,0.08)',
          }}
        >
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-3 rounded-lg text-base font-medium transition-colors"
              style={{ color: '#151515', textDecoration: 'none' }}
            >
              {l.label}
            </a>
          ))}
          <div className="h-px my-2" style={{ background: 'rgba(21,21,21,0.08)' }} />
          <Link href="/sign-in" onClick={() => setOpen(false)} className="land-btn-ghost text-center justify-center mt-1">
            Sign in
          </Link>
          <Link href="/sign-up" onClick={() => setOpen(false)} className="land-btn-primary text-center justify-center mt-1">
            Start free →
          </Link>
        </div>
      )}
    </header>
  )
}
