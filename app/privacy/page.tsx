import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as your name, email address, billing information, and the end-customer data you input into our platform (invoices, client details, expenses).</p>
        
        <h2>2. GDPR and CCPA Compliance</h2>
        <p>We process your data in strict compliance with the General Data Protection Regulation (GDPR) for European users and the California Consumer Privacy Act (CCPA) for California residents. You have the right to request access, deletion, or correction of your personal data at any time.</p>
        
        <h2>3. Data Storage and Security</h2>
        <p>Your data is stored securely on encrypted servers. We implement strict security measures to protect your personal information and financial data from unauthorized access, loss, or misuse.</p>
        
        <h2>4. Third-Party Services</h2>
        <p>We may use third-party payment processors (e.g., Razorpay, Stripe). Your payment information is securely transmitted directly to these processors and is never stored on our servers. We never sell your personal or client data to third parties.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time from your account settings. For GDPR/CCPA specific requests (such as a "Right to be Forgotten" request), please contact our Data Protection Officer at privacy@invoiceflowpro.com.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
