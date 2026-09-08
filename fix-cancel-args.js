const fs = require('fs');
let route = fs.readFileSync('app/api/admin/subscriptions/action/route.ts', 'utf8');

route = route.replace(
  /cancel\(sub\.rzpSubscriptionId, \{ cancel_at_cycle_end: 0 \}\)/,
  `cancel(sub.rzpSubscriptionId, false)`
);

fs.writeFileSync('app/api/admin/subscriptions/action/route.ts', route, 'utf8');
