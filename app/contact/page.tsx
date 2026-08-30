import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'
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
