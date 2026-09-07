const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

content = content.replace(
  /<td className="px-6 py-4 whitespace-nowrap">/g,
  `<td className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} onClick={(e) => e.stopPropagation()} /></td>\n                  <td className="px-6 py-4 whitespace-nowrap">`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
