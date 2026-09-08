const fs = require('fs');
let billing = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

billing = billing.replace(/, downgradeToFree /, ' ');
fs.writeFileSync('app/app/billing/BillingClient.tsx', billing, 'utf8');
