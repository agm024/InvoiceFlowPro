const fs = require('fs');
let client = fs.readFileSync('app/checkout/[planId]/CheckoutClient.tsx', 'utf8');

client = client.replace(
  /subscription_id: data\.subscription\.id,/,
  `subscription_id: data.subscription.id,
          customer_id: data.customer_id,`
);

fs.writeFileSync('app/checkout/[planId]/CheckoutClient.tsx', client, 'utf8');
