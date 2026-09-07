const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// Table Header
const thSearch = `<th className="px-6 py-4 rounded-tl-lg">Amount</th>`;
const thReplace = `<th className="px-6 py-4 rounded-tl-lg w-12"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0} onChange={(e) => { if (e.target.checked) setSelectedIds(paginatedInvoices.map(i => i.id)); else setSelectedIds([]); }} /></th>\n                <th className="px-6 py-4">Amount</th>`;
content = content.replace(thSearch, thReplace);

// Table Row
const tdSearch = `<td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">`;
const tdReplace = `<td className="px-6 py-4 w-12">
                  <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">`;
content = content.replace(tdSearch, tdReplace);

// If the tdSearch didn't match perfectly, let's do a more robust replace for the first td inside tbody
content = content.replace(
  /<tr key=\{invoice\.id\} className="border-b border-zinc-100 dark:border-sidebar-border hover:bg-zinc-50 dark:hover:bg-zinc-900\/50 transition-colors group">(\s*)<td className="px-6 py-4">/g,
  `<tr key={invoice.id} className="border-b border-zinc-100 dark:border-sidebar-border hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">$1<td className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} onClick={(e) => e.stopPropagation()} /></td>$1<td className="px-6 py-4">`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
