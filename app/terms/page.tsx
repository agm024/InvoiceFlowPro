import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Terms of Service (ToS) / Terms of Use</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>By accessing or using InvoiceFlowPro, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our service.</p>
        
        <h2>2. Use of Service</h2>
        <p>Our SaaS provides invoicing, client management, and expense tracking tools. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
        
        <h2>3. Liability Limits Regarding Billing Errors</h2>
        <p>While we strive for 100% accuracy, InvoiceFlowPro is not liable for any financial losses or damages resulting from calculation errors, delayed invoice generation, or billing discrepancies caused by software bugs or user input. It is the user's responsibility to verify all outgoing invoices before sending them to clients.</p>
        
        <h2>4. Service Downtime</h2>
        <p>We aim for 99.9% uptime, but we do not guarantee uninterrupted access to our platform. We shall not be held liable for any lost revenue, missed deadlines, or reputational damage resulting from planned maintenance or unexpected server downtime.</p>
        
        <h2>5. Late Payments and Platform Abuse</h2>
        <p>We are not responsible for late payments from your clients resulting from missed automated reminders or email delivery failures. InvoiceFlowPro simply acts as a conduit for your communication.</p>
        
        <h2>6. User Content</h2>
        <p>You retain full ownership of all data, clients, and invoices you create. We claim no intellectual property rights over the material you provide to the service.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
