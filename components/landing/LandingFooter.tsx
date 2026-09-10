import Link from 'next/link'

const footerLinks = {
  product: [
    { href: '#features', label: 'Features' },
    { href: '#pricing',  label: 'Pricing'  },
    { href: '/sign-in',  label: 'Sign in'  },
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
    <footer style={{ background: '#0D0D0D', color: '#6B6B67', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <style>{`
        .land-footer-link { color: #6B6B67; text-decoration: none; transition: color 0.15s; }
        .land-footer-link:hover { color: #E8E8E4; }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit land-footer-link">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#fff' }}>
                <span className="font-black text-sm" style={{ color: '#20B26B' }}>I</span>
              </div>
              <span className="font-black text-sm" style={{ color: '#E8E8E4' }}>
                InvoiceFlow<span style={{ color: '#20B26B' }}>Pro</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#444', maxWidth: 200 }}>
              Modern invoicing and billing for Indian businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Product</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.product.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="land-footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@invoiceflowpro.in" className="land-footer-link">Contact</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#E8E8E4' }}>Legal</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.legal.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="land-footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#444' }}
        >
          <p>&copy; {new Date().getFullYear()} Global One Logistics And Distribution. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#20B26B' }} />
            <span style={{ color: '#6B6B67' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
