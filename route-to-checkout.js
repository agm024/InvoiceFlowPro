const fs = require('fs');

let pricing = fs.readFileSync('app/pricing/PricingClient.tsx', 'utf8');

// Replace handleSubscribe logic to just redirect
pricing = pricing.replace(
  /const handleSubscribe = async \(planId: string, isAnnual: boolean, price: number\) => \{[\s\S]*?finally \{\n\s*setLoadingPlan\(null\);\n\s*\}\n\s*\};/,
  `const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      toast.error('Free plan is automatically applied');
      return;
    }
    router.push(\`/checkout/\${planId}?interval=\${isAnnual ? 'year' : 'month'}\`);
  };`
);

fs.writeFileSync('app/pricing/PricingClient.tsx', pricing, 'utf8');

let billing = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

billing = billing.replace(
  /const handleSubscribe = async \(planId: string, isAnnual: boolean, price: number\) => \{[\s\S]*?finally \{\n\s*setLoadingPlan\(null\);\n\s*\}\n\s*\};/,
  `const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      toast.error('Free plan is automatically applied');
      return;
    }
    router.push(\`/checkout/\${planId}?interval=\${isAnnual ? 'year' : 'month'}\`);
  };`
);

fs.writeFileSync('app/app/billing/BillingClient.tsx', billing, 'utf8');

