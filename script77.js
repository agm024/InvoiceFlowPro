const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace(
  /<label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Date \*\<\/label>\s*<input type="date"/g,
  '<label htmlFor="invoice-date" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Date *</label>\n<input id="invoice-date" type="date"'
);

content = content.replace(
  /<label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Reference Number\<\/label>\s*<input type="text"/g,
  '<label htmlFor="invoice-ref" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Reference Number</label>\n<input id="invoice-ref" type="text"'
);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
