const fs = require('fs');

let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');

route = route.replace(
  /contact: '9999999999'/,
  `contact: '9999999999',
      fail_existing: 0`
);

fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
