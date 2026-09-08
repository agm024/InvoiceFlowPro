const fs = require('fs');
let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');
route = route.replace(/customer_id: rzpCustomer\.id/, 'customer_id: rzpCustomerId');
fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
