const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

content = content.replace(
  /paginatedInvoices/g,
  `filteredInvoices`
);
content = content.replace(
  /filteredInvoices\.map\(i =>/g,
  `filteredInvoices.map((i: any) =>`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
