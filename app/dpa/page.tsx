import { MarketingNav, MarketingFooter } from '@/components/MarketingShared'

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col">
      <MarketingNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 prose dark:prose-invert">
        <h1>Data Processing Agreement (DPA)</h1>
        <p>Last updated: August 2026</p>
        
        <h2>1. Background and Scope</h2>
        <p>This Data Processing Agreement constitutes a legally binding contract between InvoiceFlowPro (the "Data Processor") and you (the "Data Controller"). It governs the processing of end-customer data that you upload into our platform, including names, emails, addresses, and invoice histories.</p>
        
        <h2>2. Processor Obligations</h2>
        <p>As a B2B platform, InvoiceFlowPro agrees to process personal data strictly on behalf of the Data Controller and solely for the purpose of providing the invoicing and client management services outlined in the Terms of Service.</p>
        
        <h2>3. Security Measures</h2>
        <p>We implement robust technical and organizational security measures to protect end-customer data against unauthorized or unlawful processing, accidental loss, destruction, or damage. This includes AES-256 encryption at rest and TLS 1.3 in transit.</p>
        
        <h2>4. Sub-processors</h2>
        <p>You authorize us to use sub-processors (such as cloud hosting providers and payment gateways) to deliver our service. We ensure that all sub-processors are bound by data protection obligations equivalent to those in this agreement.</p>
        
        <h2>5. Data Breach Notification</h2>
        <p>In the event of a security breach involving your end-customer data, we will notify you without undue delay (and in any event within 48 hours of becoming aware of it) to allow you to meet your own regulatory notification obligations.</p>
      </main>
      <MarketingFooter />
    </div>
  )
}
