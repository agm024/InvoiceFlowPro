const fs = require('fs');
let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');

route = route.replace(/fail_existing: '0'/, "fail_existing: '0' as any");

fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
