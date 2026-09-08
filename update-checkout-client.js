const fs = require('fs');
let client = fs.readFileSync('app/checkout/[planId]/CheckoutClient.tsx', 'utf8');

client = client.replace(/\/api\/razorpay\/subscription\/order/g, '/api/subscriptions/create');
client = client.replace(/\/api\/razorpay\/subscription\/verify/g, '/api/subscriptions/verify');
// We also need to change data.order.id to data.subscription.id
client = client.replace(/amount: data\.order\.amount,/g, '');
client = client.replace(/currency: data\.order\.currency,/g, '');
client = client.replace(/order_id: data\.order\.id,/g, 'subscription_id: data.subscription.id,');
// In verify payload
client = client.replace(/currency: data\.order\.currency/g, '');

fs.writeFileSync('app/checkout/[planId]/CheckoutClient.tsx', client, 'utf8');
