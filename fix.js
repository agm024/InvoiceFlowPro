const fs = require('fs');

const files = [
  'app/pricing/PricingClient.tsx',
  'app/app/billing/BillingClient.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/plan\.currency === 'INR' \? '\?' : plan\.currency;/g, "plan.currency === 'INR' ? '₹' : plan.currency;");
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed rupee symbols');
