import type { Metadata } from 'next'
import { LegalLayout } from '@/components/landing/LegalLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — InvoiceFlowPro',
  description: 'How InvoiceFlowPro collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 2026">
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as your name, email address, billing information, and the end-customer data you input into our platform (invoices, client details, expenses).</p>

      <h2>2. GDPR and CCPA Compliance</h2>
      <p>We process your data in strict compliance with the General Data Protection Regulation (GDPR) for European users and the California Consumer Privacy Act (CCPA) for California residents. You have the right to request access, deletion, or correction of your personal data at any time.</p>

      <h2>3. Data Storage and Security</h2>
      <p>Your data is stored securely on encrypted servers. We implement strict security measures to protect your personal information and financial data from unauthorized access, loss, or misuse.</p>

      <h2>4. Third-Party Services</h2>
      <p>We may use third-party payment processors (e.g., Razorpay). Your payment information is securely transmitted directly to these processors and is never stored on our servers. We never sell your personal or client data to third parties.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information at any time from your account settings. For GDPR/CCPA specific requests (such as a &ldquo;Right to be Forgotten&rdquo; request), please contact our Data Protection Officer at <a href="mailto:privacy@invoiceflowpro.in">privacy@invoiceflowpro.in</a>.</p>
    </LegalLayout>
  )
}
