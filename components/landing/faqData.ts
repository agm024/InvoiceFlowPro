export interface FAQItem {
  q: string
  a: string
}

export const HOME_FAQS: FAQItem[] = [
  {
    q: 'What is FlowRadiantPro and who is it built for?',
    a: 'FlowRadiantPro is an all-in-one Business OS and GST invoicing software engineered by SiteRadiant. It is designed specifically for Indian small businesses, freelancers, agencies, logistics providers, and consultants who need professional GST billing, automated payment reminders, and clear cash flow tracking without spreadsheet chaos.',
  },
  {
    q: 'Is FlowRadiantPro compliant with Indian GST laws?',
    a: 'Yes. FlowRadiantPro produces 100% GST-compliant tax invoices that calculate CGST, SGST, and IGST based on the state codes of your business and clients. It includes fields for your GSTIN, client GSTIN, HSN/SAC codes, and reverse charge mechanisms.',
  },
  {
    q: 'Can I bill international clients in foreign currencies?',
    a: 'Absolutely. FlowRadiantPro supports billing across 30+ global currencies (including USD, EUR, GBP, AED, and SGD) alongside Indian Rupee (INR), allowing you to send professional invoices to clients worldwide.',
  },
  {
    q: 'What features are included in the Free tier?',
    a: 'The Free tier gives you full access to create invoices, register clients, track payment statuses (Paid, Pending, Overdue), and explore the dashboard without requiring a credit card.',
  },
  {
    q: 'How does client payment tracking work?',
    a: 'FlowRadiantPro monitors the lifecycle of every invoice in real time. Invoices change states from Draft to Sent, Paid, or Overdue. You can see outstanding balances, record partial payments, and view cash flow summaries instantly on your financial dashboard.',
  },
  {
    q: 'How does FlowRadiantPro secure my financial and business data?',
    a: 'Your financial data is encrypted in transit using modern TLS 1.3 encryption and stored with AES-256 encryption at rest. FlowRadiantPro incorporates strict role-based access controls (Admin, Finance, Manager, Staff) so each team member only sees what they are authorized to manage.',
  },
]
