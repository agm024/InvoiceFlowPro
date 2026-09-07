const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace(
  /<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Notes\<\/label>\s*<textarea/g,
  '<label htmlFor="invoice-notes" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Notes</label>\n<textarea id="invoice-notes"'
);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
