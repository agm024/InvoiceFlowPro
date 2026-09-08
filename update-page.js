const fs = require('fs');

let page = fs.readFileSync('app/app/page.tsx', 'utf8');

if (!page.includes('OnboardingWidget')) {
  page = page.replace(
    /import \{ RevenueChart \} from '@\/components\/DashboardCharts'/,
    `import { RevenueChart } from '@/components/DashboardCharts'\nimport OnboardingWidget from './OnboardingWidget'`
  );

  // Remove the old full-screen early return block
  page = page.replace(
    /if \(isNewTenant\) \{[\s\S]*?\}<\/div>\s*\)\s*\}/,
    ``
  );

  // Inject the widget at the top of the main dashboard UI
  page = page.replace(
    /<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">/,
    `{!hasInvoice && <OnboardingWidget hasBusinessInfo={hasBusinessInfo} hasGst={hasGst} hasClient={hasClient} hasInvoice={hasInvoice} />}\n\n      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">`
  );

  fs.writeFileSync('app/app/page.tsx', page, 'utf8');
}
