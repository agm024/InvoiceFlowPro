const fs = require('fs');

let pricing = fs.readFileSync('app/pricing/PricingClient.tsx', 'utf8');

pricing = pricing.replace(
  /const handleSubscribe = async \(planId: string, isAnnual: boolean, price: number\) => \{[\s\S]*?router\.push/,
  `const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      toast.error('To downgrade, please go to your Billing Dashboard in the App');
      router.push('/app/billing');
      return;
    }
    router.push`
);

fs.writeFileSync('app/pricing/PricingClient.tsx', pricing, 'utf8');

