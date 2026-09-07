const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

content = content.replace(
  `href={type === 'quotation' ? '/app/estimates/new' : '/invoices/new'}`,
  `href={type === 'quotation' ? '/app/estimates/new' : '/app/invoices/new'}`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
