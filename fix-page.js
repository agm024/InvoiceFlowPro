const fs = require('fs');
let page = fs.readFileSync('app/app/page.tsx', 'utf8');

// Find start of "if (isNewTenant) {"
const startIndex = page.indexOf('if (isNewTenant) {');
if (startIndex !== -1) {
  // We need to cut out the whole if block.
  // The block looks like:
  // if (isNewTenant) {
  //   return (
  //     <div ...
  //       ...
  //     </div>
  //   )
  // }
  // We can just replace using regex more carefully
  const nextReturn = page.indexOf('return (', startIndex + 100);
  page = page.slice(0, startIndex) + page.slice(nextReturn);
}

// Inject widget
if (!page.includes('<OnboardingWidget')) {
  page = page.replace(
    /<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">/,
    `{!hasInvoice && <OnboardingWidget hasBusinessInfo={hasBusinessInfo} hasGst={hasGst} hasClient={hasClient} hasInvoice={hasInvoice} />}\n\n      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">`
  );
}

fs.writeFileSync('app/app/page.tsx', page, 'utf8');
