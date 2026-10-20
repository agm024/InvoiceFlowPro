import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { Mail, Phone, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us & Support — FlowRadiantPro by SiteRadiant',
  description: 'Get in touch with the FlowRadiantPro support team for assistance with GST billing, subscriptions, or platform integration. Based in Bengaluru, India.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact FlowRadiantPro Support | By SiteRadiant',
    description: 'Get in touch with the FlowRadiantPro team for questions, sales inquiries, or technical support.',
    url: 'https://flow.siteradiant.co.in/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact FlowRadiantPro Support',
    'url': 'https://flow.siteradiant.co.in/contact',
    'description': 'Contact FlowRadiantPro support for questions regarding GST billing, onboarding, subscriptions, or technical assistance.',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'FlowRadiantPro',
      'url': 'https://flow.siteradiant.co.in/',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-7208999095',
        'email': 'support@siteradiant.co.in',
        'contactType': 'customer support',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi'],
      },
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://flow.siteradiant.co.in/',
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Contact',
          'item': 'https://flow.siteradiant.co.in/contact',
        },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4">
            Support &amp; Inquiries
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Contact FlowRadiantPro
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Have questions about GST invoicing, subscription tiers, or custom business workflows? Our support team is here to assist.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Registered Office</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  FlowRadiant Solutions (SiteRadiant)<br/>
                  123 Business Hub, 4th Floor<br/>
                  Koramangala, Bengaluru<br/>
                  Karnataka 560034, India
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Email Support</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  <a href="mailto:support@siteradiant.co.in" className="hover:underline font-medium text-zinc-900 dark:text-white">support@siteradiant.co.in</a><br/>
                  <span className="text-sm">We respond within 24 business hours.</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Phone Support</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  <a href="tel:+917208999095" className="hover:underline font-medium text-zinc-900 dark:text-white">+91 7208999095</a><br/>
                  <span className="text-sm">Monday – Friday, 9:00 AM – 6:00 PM IST</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-xl mb-6">Send us a message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm" placeholder="e.g. Ramesh Kumar" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Email</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm" placeholder="ramesh@company.in" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message or Query</label>
                <textarea rows={4} className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm" placeholder="How can we help your business?"></textarea>
              </div>
              <a
                href="mailto:support@siteradiant.co.in"
                className="block text-center w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send via Email
              </a>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
