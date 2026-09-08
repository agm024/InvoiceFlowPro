const fs = require('fs');

let client = fs.readFileSync('app/checkout/[planId]/CheckoutClient.tsx', 'utf8');

client = client.replace(
  /prefill: \{[\s\S]*?\},/,
  ''
);

fs.writeFileSync('app/checkout/[planId]/CheckoutClient.tsx', client, 'utf8');
