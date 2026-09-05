const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/InvoiceActionsDropdown.tsx', 'utf8');

content = content.replace(
  "toast.error('Failed to convert to invoice')",
  "toast.error(res.error || 'Failed to convert to invoice')"
);

fs.writeFileSync('app/app/invoices/[id]/InvoiceActionsDropdown.tsx', content, 'utf8');
