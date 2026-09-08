const fs = require('fs');

let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

// Inject Script and toast and useRouter if missing
client = client.replace(/import \{ useState, useTransition \} from 'react'/, "import { useState, useTransition } from 'react'\nimport Script from 'next/script'\nimport { useRouter } from 'next/navigation'\nimport toast from 'react-hot-toast'");

// Add handleSubscribe
const handleSubscribeLogic = `
  const router = useRouter();
  const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      toast.error('Free plan is automatically applied');
      return;
    }
    
    try {
      const res = await fetch('/api/razorpay/subscription/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isAnnual })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'InvoiceFlowPro',
        description: 'Subscription Upgrade',
        order_id: data.order.id,
        handler: async function (response: any) {
          toast.loading('Verifying payment...', { id: 'verify' });
          const verifyRes = await fetch('/api/razorpay/subscription/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              planId,
              isAnnual,
              companyId: data.user.companyId,
              amount: data.amount,
              currency: data.order.currency
            })
          });
          
          if (verifyRes.ok) {
            toast.success('Subscription activated successfully!', { id: 'verify' });
            router.refresh();
          } else {
            toast.error('Payment verification failed', { id: 'verify' });
          }
        },
        theme: { color: '#2563eb' }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment failed');
      });
      rzp.open();
      
    } catch (err: any) {
      toast.error(err.message);
    }
  };
`;

client = client.replace(/export function BillingClient\([^)]*\) \{/, `$& \n${handleSubscribeLogic}`);

// Replace the button logic
client = client.replace(
  /onClick=\{\(\) => \{\s*startTransition\(async \(\) => \{\s*await createCheckoutSession\(plan\.id, isAnnual \? 'year' : 'month'\);\s*\}\);\s*\}\}/,
  `onClick={() => handleSubscribe(plan.id, isAnnual, isAnnual ? plan.yearlyPrice : plan.monthlyPrice)}`
);

// Add the Script tag to the return
client = client.replace(
  /return \(\s*<div/,
  `return (\n    <div className="w-full">\n      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />\n      <div`
);
client = client.replace(/<\/div>\n  \)$/, `</div>\n    </div>\n  )`);


fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');
