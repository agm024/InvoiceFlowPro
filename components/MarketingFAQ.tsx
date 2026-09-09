'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is InvoiceFlowPro free?",
    answer: "Yes! You can start entirely for free with no credit card required. Our free tier includes standard invoicing tools. You can upgrade to a paid plan as your business scales and demands more features."
  },
  {
    question: "Can I create professional invoices?",
    answer: "Absolutely. You can generate clean, professional PDF invoices in seconds and send them directly to your customers."
  },
  {
    question: "Can I manage multiple customers?",
    answer: "Yes, you can save customer details, contact info, and billing addresses so you never have to re-type them for new invoices."
  },
  {
    question: "Can I track paid and pending invoices?",
    answer: "Our dashboard gives you a real-time overview of your business revenue, highlighting exactly which invoices are paid, pending, or overdue."
  },
  {
    question: "Can multiple team members use the account?",
    answer: "Yes, on our premium plans you can invite team members and assign them roles (like admin or member) to control what they can see and edit."
  },
  {
    question: "Does InvoiceFlowPro support multiple currencies?",
    answer: "Yes. You can invoice international clients in their local currency, and we will accurately track the exchange rate at the time of the invoice."
  },
  {
    question: "Can I remove the PDF watermark?",
    answer: "Yes, upgrading to any of our paid plans instantly removes the InvoiceFlowPro watermark from your generated PDFs."
  },
  {
    question: "Is GST invoicing supported?",
    answer: "Yes! InvoiceFlowPro is built for Indian businesses and fully supports GST calculations, ITC tracking, and Indian Rupee (INR) formatting."
  },
  {
    question: "Is my business data secure?",
    answer: "We use secure authentication, encrypted database connections, and reliable cloud infrastructure to keep your business billing data safe."
  },
  {
    question: "Can I upgrade or cancel my plan?",
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your billing settings."
  }
];

export function MarketingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto w-full space-y-4">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300"
        >
          <button 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{faq.question}</span>
            <ChevronDown 
              className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
            />
          </button>
          
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
