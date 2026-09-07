const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

content = content.replace(/\/app\/quotations\/new/g, '/app/estimates/new');
content = content.replace(/\/quotations\/new/g, '/app/estimates/new');

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
