const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// Find the start of the mobile card
content = content.replace(
  /<div key=\{invoice\.id\} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3">/g,
  `<div key={invoice.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 relative">\n              <div className="absolute top-4 left-4 z-10">\n                <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} onClick={(e) => e.stopPropagation()} />\n              </div>\n              <div className="pl-8">`
);

// We need to close that <div className="pl-8"> at the end of the mobile card? Or just wrap the top section
// Actually it's easier to just add it next to the name
content = content.replace(
  /<div className="font-semibold text-zinc-900 dark:text-white text-base">\{invoice\.client\.name\}<\/div>/g,
  `<div className="font-semibold text-zinc-900 dark:text-white text-base flex items-center gap-2"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} onClick={(e) => e.stopPropagation()} /> {invoice.client.name}</div>`
);

// Undo the absolute div attempt
content = content.replace(
  /<div key=\{invoice\.id\} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 relative">\n              <div className="absolute top-4 left-4 z-10">\n                <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked=\{selectedIds\.includes\(invoice\.id\)\} onChange=\{\(e\) => \{ if \(e\.target\.checked\) setSelectedIds\(\[\.\.\.selectedIds, invoice\.id\]\); else setSelectedIds\(selectedIds\.filter\(id => id !== invoice\.id\)\); \}\} onClick=\{\(e\) => e\.stopPropagation\(\)\} \/>\n              <\/div>\n              <div className="pl-8">/g,
  `<div key={invoice.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3">`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
