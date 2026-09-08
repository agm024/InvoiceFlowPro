const fs = require('fs');

let page = fs.readFileSync('app/app/page.tsx', 'utf8');

// 1. Fix isNewTenant logic
page = page.replace(
  /const isNewTenant = allInvoices\.length === 0 && allClientsCount === 0/,
  `const company = await prisma.company.findUnique({ where: { id: companyId } });
  const hasBusinessInfo = Boolean(company?.address && company?.city);
  const hasGst = Boolean(company?.gstin);
  const hasClient = allClientsCount > 0;
  const hasInvoice = allInvoices.length > 0;
  
  // Only hide the checklist when they have actually created their first invoice
  const isNewTenant = !hasInvoice;`
);

// 2. Replace hardcoded checklist with dynamic checklist
const dynamicChecklist = `
              <li className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</div>
                Create account
              </li>
              <li className={\`flex items-center gap-3 \${hasBusinessInfo ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}\`}>
                <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs \${hasBusinessInfo ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}\`}>{hasBusinessInfo ? '✓' : ''}</div>
                <Link href="/app/settings" className="hover:underline">Add business information</Link>
              </li>
              <li className={\`flex items-center gap-3 \${hasGst ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}\`}>
                <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs \${hasGst ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}\`}>{hasGst ? '✓' : ''}</div>
                <Link href="/app/settings" className="hover:underline">Configure GST/Tax settings</Link>
              </li>
              <li className={\`flex items-center gap-3 \${hasClient ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500'}\`}>
                <div className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs \${hasClient ? 'bg-blue-600 text-white' : 'border-2 border-zinc-200 dark:border-zinc-700'}\`}>{hasClient ? '✓' : ''}</div>
                <Link href="/app/clients/new" className="hover:underline">Add your first client</Link>
              </li>
              <li className="flex items-center gap-3 text-zinc-500">
                <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"></div>
                <Link href="/app/invoices/new" className="hover:underline text-blue-600 dark:text-blue-400 font-semibold">Create your first invoice ➔</Link>
              </li>
`;

page = page.replace(
  /<li className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium">[\s\S]*?<div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"><\/div>\s*Create your first invoice\s*<\/li>/,
  dynamicChecklist
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');
