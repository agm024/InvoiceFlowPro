const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace("toast.error('Error saving document')", "toast.error(res.error || 'Error saving document')");

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
