const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/page.tsx', 'utf8');

content = content.replace(
  'const { clients, products, banks, exchangeRates, nextInvoiceNumber, companySettings } = await getInvoiceFormData()',
  'const { clients, products, banks, exchangeRates, nextInvoiceNumber, companySettings, isLimitReached } = await getInvoiceFormData()'
);

content = content.replace(
  'companySettings={companySettings}',
  'companySettings={companySettings}\n        isLimitReached={isLimitReached}'
);

fs.writeFileSync('app/app/invoices/new/page.tsx', content, 'utf8');
