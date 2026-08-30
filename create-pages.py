import os

routes = ["terms", "privacy", "pricing", "refund-policy", "contact"]
for route in routes:
    os.makedirs(f"app/{route}", exist_ok=True)

nav = """import Link from 'next/link'
import { auth } from '@/auth'

export async function MarketingNav() {
  const session = await auth()
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 max-w-7xl mx-auto w-full border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
          <span className="text-white dark:text-zinc-900 font-bold text-xl">I</span>
        </div>
        <span className="font-bold text-xl tracking-tight">InvoiceFlow<span className="text-blue-600 dark:text-blue-500">Pro</span></span>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Pricing</Link>
        <Link href="/contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition">Contact</Link>
        {session ? (
          <Link href="/app" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-zinc-200 transition">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/sign-in" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
              Log in
            </Link>
            <Link href="/sign-up" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-black dark:hover:bg-zinc-200 transition">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export function MarketingFooter() {
  return (
    <footer className="py-12 mt-auto border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/sign-in">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund-policy">Refund & Cancellation</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-zinc-500 text-sm">
        &copy; {new Date().getFullYear()} InvoiceFlowPro. All rights reserved.
      </div>
    </footer>
  )
}
"""

with open("components/MarketingShared.tsx", "w", encoding="utf-8") as f:
    f.write(nav)

terms = """import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Terms & Conditions</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>By accessing or using InvoiceFlowPro, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our service.</p>
        
        <h2>2. Use of Service</h2>
        <p>Our SaaS provides invoicing, client management, and expense tracking tools. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
        
        <h2>3. Subscription and Billing</h2>
        <p>You will be billed in advance on a recurring and periodic basis depending on your subscription plan. You must provide accurate billing information. Invoices are generated automatically.</p>
        
        <h2>4. User Content</h2>
        <p>You retain full ownership of all data, clients, and invoices you create. We claim no intellectual property rights over the material you provide to the service.</p>
        
        <h2>5. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.</p>
        
        <h2>6. Limitation of Liability</h2>
        <p>In no event shall InvoiceFlowPro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
"""
with open("app/terms/page.tsx", "w", encoding="utf-8") as f: f.write(terms)

privacy = """import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as your name, email address, billing information, and the data you input into our platform (invoices, client details, expenses).</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information to provide, maintain, and improve our services, process transactions, send technical notices, and provide customer support.</p>
        
        <h2>3. Data Storage and Security</h2>
        <p>Your data is stored securely on encrypted servers. We implement strict security measures to protect your personal information and financial data from unauthorized access.</p>
        
        <h2>4. Third-Party Services</h2>
        <p>We may use third-party payment processors (e.g., Razorpay, Stripe). Your payment information is securely transmitted directly to these processors and is never stored on our servers.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time from your account settings or by contacting our support team.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
"""
with open("app/privacy/page.tsx", "w", encoding="utf-8") as f: f.write(privacy)

refund = """import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Refund & Cancellation Policy</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. How to Cancel</h2>
        <p>You can cancel your subscription at any time directly from your <strong>Dashboard > Billing & Plans</strong> page. Simply click on "Cancel Subscription". No emails or phone calls are required to cancel.</p>
        
        <h2>2. Post-Cancellation Access</h2>
        <p>When you cancel your subscription, you will continue to have full access to your account and premium features until the end of your current billing period. Your account will then be downgraded to read-only access.</p>
        
        <h2>3. Refund Policy (Prorated Refunds)</h2>
        <p>We offer prorated refunds within the first <strong>14 days</strong> of your initial subscription or renewal.</p>
        <ul>
          <li>If you cancel within 14 days of your purchase, you are eligible for a prorated refund based on the days used.</li>
          <li>After 14 days, your subscription payment is non-refundable, and you will retain access for the remainder of the billing cycle.</li>
        </ul>
        
        <h2>4. Requesting a Refund</h2>
        <p>To request a prorated refund within the eligible 14-day window, please contact our support team at <strong>support@invoiceflowpro.com</strong> with your account details.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
"""
with open("app/refund-policy/page.tsx", "w", encoding="utf-8") as f: f.write(refund)

contact = """import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12">Have questions about our platform, pricing, or need technical support? We're here to help.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Physical Address</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  InvoiceFlowPro Solutions<br/>
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
                  support@invoiceflowpro.com<br/>
                  <span className="text-sm">We aim to reply within 24 hours.</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Phone Number</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                  +91 98765 43210<br/>
                  <span className="text-sm">Mon-Fri, 9:00 AM - 6:00 PM IST</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-xl mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
"""
with open("app/contact/page.tsx", "w", encoding="utf-8") as f: f.write(contact)

pricing = """import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Transparent pricing for every business</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">No hidden fees. Pay only for what you need. Upgrade or downgrade at any time.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold text-zinc-500 mb-2">Starter</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹19,000</span><span className="text-zinc-500"> /year</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Perfect for freelancers and sole proprietors starting out.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> 1 Team Member</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Up to 50 Clients</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> 200 Invoices / year</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Basic Reporting</li>
              <li className="flex items-center gap-3 text-zinc-400"><XCircle size={20}/> Client Portal</li>
            </ul>
            <Link href="/sign-up" className="block text-center w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Get Started</Link>
          </div>
          
          {/* Pro */}
          <div className="bg-blue-600 text-white rounded-3xl p-8 border border-blue-600 flex flex-col shadow-xl relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-950 px-4 py-1 rounded-full text-sm font-bold shadow-sm">Most Popular</div>
            <h3 className="text-xl font-bold text-blue-200 mb-2">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹29,000</span><span className="text-blue-200"> /year</span>
            </div>
            <p className="text-blue-100 mb-8">Everything you need to grow your small business or agency.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> 5 Team Members</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Up to 500 Clients</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> 1,000 Invoices / year</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Advanced Reporting</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-cyan-300" size={20}/> Dedicated Client Portal</li>
            </ul>
            <Link href="/sign-up" className="block text-center w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-zinc-50 transition shadow-sm">Start Free Trial</Link>
          </div>
          
          {/* Enterprise */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold text-zinc-500 mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹49,000</span><span className="text-zinc-500"> /year</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Uncapped potential for large organizations.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Unlimited Team Members</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Unlimited Clients</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Unlimited Invoices</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Custom Branding</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={20}/> Priority 24/7 Support</li>
            </ul>
            <Link href="/contact" className="block text-center w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Contact Sales</Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
"""
with open("app/pricing/page.tsx", "w", encoding="utf-8") as f: f.write(pricing)

print("Created all pages.")
