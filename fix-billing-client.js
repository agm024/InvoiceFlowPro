const fs = require('fs');
let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

client = client.replace(
  /\{loadingPlan === plan\.id \? 'Processing\.\.\.' : isCurrentPlan\s*\n\s*\? \(subscription\?\.status === 'active' && subscription\?\.billingInterval === intervalLabel \? 'Current Plan' : 'Update Plan'\)\s*\n\s*: 'Subscribe'\}/,
  `{loadingPlan === plan.id ? 'Processing...' : isCurrentPlan 
                  ? ((subscription?.status === 'active' || subscription?.status === 'paused' || price === 0) ? 'Current Plan' : 'Update Plan') 
                  : 'Subscribe'}`
);

fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');
