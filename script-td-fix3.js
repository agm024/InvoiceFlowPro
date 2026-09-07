const fs = require('fs');
let file = 'app/app/invoices/InvoiceListClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/colSpan=\{7\}/g, `colSpan={8}`);

fs.writeFileSync(file, content, 'utf8');
