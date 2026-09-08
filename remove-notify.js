const fs = require('fs');
let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');

route = route.replace(/customer_notify: 1,/g, 'customer_notify: 0,');
fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
