/**
 * LegalLayout — shared wrapper for all legal pages.
 * Matches the landing page visual identity:
 * warm ivory bg, charcoal text, Geist font, new nav + footer.
 * Server Component — no 'use client' needed.
 */
import Link from 'next/link'
import { auth } from '@/auth'
import { LandingNav } from '@/components/landing/LandingNav'
import { LandingFooter } from '@/components/landing/LandingFooter'
import '@/app/landing.css'

const LEGAL_LINKS = [
  { href: '/terms',         label: 'Terms & Conditions'    },
  { href: '/privacy',       label: 'Privacy Policy'        },
  { href: '/refund-policy', label: 'Refund & Cancellation' },
  { href: '/dpa',           label: 'Data Processing'       },
]

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export async function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const session = await auth()

  return (
    <div data-landing="true" className="flex flex-col min-h-screen">
      <LandingNav isLoggedIn={!!session?.user} />

      {/* Breadcrumb skip + landmark */}
      <a
        href="#legal-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-6 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
        style={{ background: '#151515', color: '#F7F6F2' }}
      >
        Skip to content
      </a>

      <main id="legal-content" className="flex-1 pt-24 pb-24" style={{ background: '#F7F6F2' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 pb-10" style={{ borderBottom: '1px solid rgba(21,21,21,0.10)' }}>
            <div
              className="text-[10px] font-bold tracking-[0.18em] uppercase mb-4"
              style={{ color: '#20B26B' }}
            >
              Legal
            </div>
            <h1
              className="font-black tracking-tighter mb-3 leading-[1.05]"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                color: '#151515',
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>
            <p className="text-sm" style={{ color: '#9B9B96' }}>Last updated: {lastUpdated}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar nav */}
            <aside aria-label="Legal pages navigation" className="hidden lg:block">
              <nav>
                <p
                  className="text-[10px] font-bold tracking-[0.18em] uppercase mb-4"
                  style={{ color: '#9B9B96' }}
                >
                  Legal documents
                </p>
                <ul className="space-y-1">
                  {LEGAL_LINKS.map(l => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ color: '#6B6B67', textDecoration: 'none' }}
                        aria-current={undefined}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              <div
                className="prose prose-sm max-w-none"
                style={{
                  '--tw-prose-body': '#6B6B67',
                  '--tw-prose-headings': '#151515',
                  '--tw-prose-bold': '#151515',
                  '--tw-prose-links': '#20B26B',
                  '--tw-prose-hr': 'rgba(21,21,21,0.10)',
                  '--tw-prose-bullets': '#9B9B96',
                  lineHeight: 1.8,
                } as React.CSSProperties}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
