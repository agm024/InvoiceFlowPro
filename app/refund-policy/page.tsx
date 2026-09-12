import type { Metadata } from 'next'
import { LegalLayout } from '@/components/landing/LegalLayout'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — FlowRadiant',
  description: 'FlowRadiant refund, cancellation, and chargeback policy.',
}

export default function RefundPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" lastUpdated="August 2026">
      <h2>1. Subscription Tiers</h2>
      <p>We offer three subscription tiers: Free, Pro, and Max. The Free plan has no billing. Paid plans (Pro and Max) are billed monthly or annually depending on your selection at checkout.</p>

      <h2>2. How to Cancel</h2>
      <p>You can cancel your subscription at any time directly from your <strong>Dashboard &rsaquo; Billing &amp; Plans</strong> page. No emails or phone calls are required.</p>

      <h2>3. Refund Policy (Prorated Refunds)</h2>
      <p>We offer prorated refunds within the first <strong>14 days</strong> of your initial subscription or renewal.</p>
      <ul>
        <li>If you cancel within 14 days of your purchase, you are eligible for a prorated refund based on the days used.</li>
        <li>After 14 days, your subscription payment is completely non-refundable, and you will retain access for the remainder of the billing cycle.</li>
      </ul>

      <h2>4. Chargeback Procedures</h2>
      <p>If you initiate a chargeback or dispute with your credit card provider or bank without first contacting us to seek a resolution, your FlowRadiant account will be immediately suspended pending the outcome of the dispute. Fraudulent chargebacks will result in a permanent ban.</p>

      <h2>5. Contact</h2>
      <p>For refund requests or billing queries, contact us at <a href="mailto:billing@flowradiant.in">billing@flowradiant.in</a>.</p>
    </LegalLayout>
  )
}
