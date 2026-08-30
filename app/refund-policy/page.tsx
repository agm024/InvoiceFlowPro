import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Billing &amp; Refund Policy</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Subscription Tiers and Trial Parameters</h2>
        <p>We offer three subscription tiers: Starter, Pro, and Enterprise. New users are eligible for a 14-day free trial on the Pro tier. At the end of the 14-day trial, your account will be automatically suspended unless a valid payment method is added.</p>
        
        <h2>2. How to Cancel</h2>
        <p>You can cancel your subscription at any time directly from your <strong>Dashboard &gt; Billing &amp; Plans</strong> page. No emails or phone calls are required.</p>
        
        <h2>3. Refund Boundaries (Prorated Refunds)</h2>
        <p>We offer prorated refunds within the first <strong>14 days</strong> of your initial subscription or renewal.</p>
        <ul>
          <li>If you cancel within 14 days of your purchase, you are eligible for a prorated refund based on the days used.</li>
          <li>After 14 days, your subscription payment is completely non-refundable, and you will retain access for the remainder of the billing cycle.</li>
        </ul>
        
        <h2>4. Chargeback Procedures</h2>
        <p>If you initiate a chargeback or dispute with your credit card provider or bank without first contacting us to seek a resolution or refund, your InvoiceFlowPro account will be immediately suspended pending the outcome of the dispute. Fraudulent chargebacks will result in a permanent ban.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
