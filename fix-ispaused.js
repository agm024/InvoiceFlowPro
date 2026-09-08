const fs = require('fs');

let page = fs.readFileSync('app/app/billing/page.tsx', 'utf8');

if (!page.includes('const isPaused')) {
  page = page.replace(
    /const isWarningStatus = .*?canceled'/,
    `$&
  const isPaused = subscription?.status === 'paused'`
  );
  fs.writeFileSync('app/app/billing/page.tsx', page, 'utf8');
}
