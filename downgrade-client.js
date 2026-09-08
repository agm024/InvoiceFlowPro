const fs = require('fs');

let billing = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

// Ensure downgradeToFree is imported
if (!billing.includes('downgradeToFree')) {
  billing = billing.replace(
    /import \{ createCheckoutSession \} from '\.\/actions'/,
    `import { createCheckoutSession, downgradeToFree } from './actions'`
  );
}

billing = billing.replace(
  /const handleSubscribe = async \(planId: string, isAnnual: boolean, price: number\) => \{[\s\S]*?router\.push/,
  `const handleSubscribe = async (planId: string, isAnnual: boolean, price: number) => {
    if (price <= 0) {
      if (confirm('Are you sure you want to downgrade to the Free plan? You may lose access to premium features.')) {
        setLoadingPlan(planId);
        try {
          await downgradeToFree();
          toast.success('Successfully downgraded to Free plan');
          router.refresh();
        } catch (e: any) {
          toast.error('Failed to downgrade');
        } finally {
          setLoadingPlan(null);
        }
      }
      return;
    }
    router.push`
);

// We should also change the CTA text for the Free plan if they are on a paid plan
// Right now it says "Subscribe"
billing = billing.replace(
  /\{loadingPlan === plan\.id \? 'Processing\.\.\.' : isCurrentPlan\n\s*\? \(subscription\?\.status === 'active' && subscription\?\.billingInterval === intervalLabel \? 'Current Plan' : 'Update Plan'\)\n\s*: 'Subscribe'\}/g,
  `{loadingPlan === plan.id ? 'Processing...' : isCurrentPlan
                  ? (subscription?.status === 'active' && (subscription?.billingInterval === intervalLabel || price === 0) ? 'Current Plan' : 'Update Plan') 
                  : (price === 0 ? 'Downgrade to Free' : 'Subscribe')}`
);

fs.writeFileSync('app/app/billing/BillingClient.tsx', billing, 'utf8');

