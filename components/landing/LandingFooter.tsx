import Link from 'next/link'

const footerLinks = {
  product: [
    { href: '#product',  label: 'Product Overview' },
    { href: '#features', label: 'Features' },
    { href: '/pricing',  label: 'Pricing & Plans'  },
    { href: '#faq',      label: 'FAQs' },
    { href: '/sign-in',  label: 'Sign In'  },
  ],
  company: [
    { href: '/about', label: 'About FlowRadiantPro' },
    { href: '/contact', label: 'Contact & Support' },
    { href: 'https://status.siteradiant.co.in', label: 'System Status', external: true },
    { href: 'https://github.com/agm024', label: 'Creator: Agastya (agm024)', external: true },
    { href: 'https://twitter.com/SiteRadiant', label: 'Twitter', external: true },
    { href: 'https://www.linkedin.com/company/siteradiant', label: 'LinkedIn', external: true },
  ],
  legal: [
    { href: '/terms',         label: 'Terms & Conditions'    },
    { href: '/privacy',       label: 'Privacy Policy'        },
    { href: '/refund-policy', label: 'Refund & Cancellation' },
    { href: '/dpa',           label: 'Data Processing'       },
  ],
}

export function LandingFooter() {
  return (
    <footer
      aria-label="Site footer"
      style={{ background: '#0D0D0D', color: '#9B9B96', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit land-footer-link" aria-label="FlowRadiantPro home">
              <img src="/logo.png" alt="FlowRadiantPro Logo by SiteRadiant" width={28} height={28} className="w-7 h-7 rounded-lg shrink-0" />
              <span className="font-black text-sm" style={{ color: '#E8E8E4' }}>
                FlowRadiant<span style={{ color: '#06B6D4' }}>Pro</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#9B9B96', maxWidth: 220 }}>
              The all-in-one Business OS and GST invoicing software for Indian SMBs. Built with precision by{' '}
              <a
                href="https://github.com/agm024"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white underline"
              >
                Agastya (agm024)
              </a>{' '}
              under SiteRadiant.
            </p>
          </div>

          {/* Product */}
          <nav aria-label="Product links">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Product</h2>
            <ul className="space-y-3 text-sm" role="list">
              {footerLinks.product.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="land-footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Company</h2>
            <ul className="space-y-3 text-sm" role="list">
              {footerLinks.company.map(l => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="land-footer-link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="land-footer-link">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Legal</h2>
            <ul className="space-y-3 text-sm" role="list">
              {footerLinks.legal.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="land-footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#9B9B96' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <p>&copy; {new Date().getFullYear()} Global One Logistics And Distribution. All rights reserved.</p>
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <p>
              Crafted by{' '}
              <a
                href="https://github.com/agm024"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}
              >
                Agastya
              </a>{' '}
              at{' '}
              <a
                href="https://siteradiant.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}
              >
                SiteRadiant
              </a>
            </p>
          </div>
          <a 
            href="https://status.siteradiant.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors" 
            aria-label="System status: operational"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#06B6D4' }} aria-hidden="true" />
            <span style={{ color: 'inherit' }}>All systems operational</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
