const fs = require('fs');
let file = 'app/app/invoices/InvoiceListClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the row rendering: <tr key={invoice.id} className="...">
// Add the td before {/* Amount */}

content = content.replace(
  /\{\/\* Amount \*\/\}\s*<td className="px-6 py-4 whitespace-nowrap">/g,
  `{/* Checkbox */}\n                  <td className="px-6 py-4 w-12">\n                    <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} onClick={(e) => e.stopPropagation()} />\n                  </td>\n                  {/* Amount */}\n                  <td className="px-6 py-4 whitespace-nowrap">`
);

fs.writeFileSync(file, content, 'utf8');
