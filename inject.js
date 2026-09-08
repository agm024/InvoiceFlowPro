const fs = require('fs');
let page = fs.readFileSync('app/app/page.tsx', 'utf8');

page = page.replace(
  /<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">/,
  `{!hasInvoice && <OnboardingWidget hasBusinessInfo={hasBusinessInfo} hasGst={hasGst} hasClient={hasClient} hasInvoice={hasInvoice} />}\n\n        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">`
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');
