import type { Metadata } from 'next'
import { LegalLayout } from '@/components/landing/LegalLayout'

export const metadata: Metadata = {
  title: 'Terms & Conditions — InvoiceFlowPro',
  description: 'Terms of service governing your use of InvoiceFlowPro.',
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="August 2026">
      <h2>1. Agreement to Terms</h2>
      <p>By accessing or using InvoiceFlowPro, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our service.</p>

      <h2>2. Use of Service</h2>
      <p>Our platform provides invoicing, client management, and expense tracking tools. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>

      <h2>3. Liability Limits Regarding Billing Errors</h2>
      <p>While we strive for 100% accuracy, InvoiceFlowPro is not liable for any financial losses or damages resulting from calculation errors, delayed invoice generation, or billing discrepancies caused by software bugs or user input. It is the user&apos;s responsibility to verify all outgoing invoices before sending them to clients.</p>

      <h2>4. Service Downtime</h2>
      <p>We aim for 99.9% uptime, but we do not guarantee uninterrupted access to our platform. We shall not be held liable for any lost revenue, missed deadlines, or reputational damage resulting from planned maintenance or unexpected server downtime.</p>

      <h2>5. Late Payments and Platform Abuse</h2>
      <p>We are not responsible for late payments from your clients resulting from missed automated reminders or email delivery failures. InvoiceFlowPro simply acts as a conduit for your communication.</p>

      <h2>6. User Content</h2>
      <p>You retain full ownership of all data, clients, and invoices you create. We claim no intellectual property rights over the material you provide to the service.</p>
    </LegalLayout>
  )
}
