const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

const search = `className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm">Save Product</button>`;
const replace = `className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 rounded-lg font-medium hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm">Save Product</button>`;
content = content.replace(search, replace);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
