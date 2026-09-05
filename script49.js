const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace(
  '  adHocMilestoneDetails,\n  companySettings\n}: {',
  '  adHocMilestoneDetails,\n  companySettings,\n  isLimitReached\n}: {'
);

content = content.replace(
  '  adHocMilestoneDetails?: any,\n  companySettings?: any\n}) {',
  '  adHocMilestoneDetails?: any,\n  companySettings?: any,\n  isLimitReached?: boolean\n}) {'
);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
