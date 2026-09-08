const fs = require('fs');
let billing = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

// Fix isCurrentPlan
billing = billing.replace(
  "const isCurrentPlan = subscription?.planId === plan.id",
  "const isCurrentPlan = subscription?.planId === plan.id || (!subscription && price === 0)"
);

// Fix downgrade logic to use /api/subscriptions/cancel
billing = billing.replace(
  /await downgradeToFree\(\);/,
  `const cancelRes = await fetch('/api/subscriptions/cancel', { method: 'POST' });
          if (!cancelRes.ok) throw new Error('Failed to cancel on Razorpay');`
);

fs.writeFileSync('app/app/billing/BillingClient.tsx', billing, 'utf8');
console.log('Fixed BillingClient');
