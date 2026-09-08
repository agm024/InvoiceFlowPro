const fs = require('fs');
let content = fs.readFileSync('app/app/page.tsx', 'utf8');

// Add allClientsCount
if (!content.includes('allClientsCount = await prisma.client.count')) {
    content = content.replace(
        'const topClients = (await prisma.client.findMany({ where: { companyId }, include: { invoices: true } }))',
        'const allClientsCount = await prisma.client.count({ where: { companyId } })\n  const topClients = (await prisma.client.findMany({ where: { companyId }, include: { invoices: true } }))'
    );
}

// Check for empty state logic
if (!content.includes('isNewTenant')) {
    content = content.replace(
        'return (',
        `const isNewTenant = allInvoices.length === 0 && allClientsCount === 0

  if (isNewTenant) {
    return (
      <div className="p-6 md:p-12 max-w-4xl mx-auto w-full text-zinc-950 dark:text-zinc-50 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">Welcome to InvoiceFlow!</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 text-center max-w-xl mb-12">
          Let's get your business ready to send its first invoice. Create your first professional invoice in less than a minute.
        </p>
        
        <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl mb-8">
          <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
            <span>Get your account ready</span>
            <span className="text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">Step 1 of 5</span>
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-medium">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">✓</div>
              Create account
            </li>
            <li className="flex items-center gap-3 text-zinc-500">
              <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"></div>
              Add business information
            </li>
            <li className="flex items-center gap-3 text-zinc-500">
              <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"></div>
              Configure GST/Tax settings
            </li>
            <li className="flex items-center gap-3 text-zinc-500">
              <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"></div>
              Add your first client
            </li>
            <li className="flex items-center gap-3 text-zinc-500">
              <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"></div>
              Create your first invoice
            </li>
          </ul>
        </div>

        <Link href="/app/invoices/new" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 flex items-center gap-2">
          <span className="text-xl">+</span> Create Your First Invoice
        </Link>
      </div>
    )
  }

  return (`
    );
}

// Replace the specific text
content = content.replace(
    'Tenant Dashboard monitoring real-time transactions.',
    'Monitor real-time transactions and business health.'
);
content = content.replace(
    '<h1 className="text-3xl font-extrabold tracking-tight">Financial Overview</h1>',
    '<h1 className="text-3xl font-extrabold tracking-tight">Your Financial Overview</h1>'
);

fs.writeFileSync('app/app/page.tsx', content, 'utf8');
