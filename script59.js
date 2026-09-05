const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

content = content.replace(
  '  banks = []\n}: {',
  '  banks = [],\n  isLimitReached = false\n}: {'
);
content = content.replace(
  '  banks?: any[] \n}) {',
  '  banks?: any[],\n  isLimitReached?: boolean\n}) {'
);

const searchNewBtn = `<Link 
              href={type === 'quotation' ? "/app/quotations/new" : "/app/invoices/new"} 
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap"
            >
              <Plus size={18} /> <span className="hidden sm:inline">New {type === 'quotation' ? 'Quotation' : 'Invoice'}</span>
            </Link>`;

const replacementNewBtn = `{isLimitReached ? (
              <button 
                disabled
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap cursor-not-allowed"
                title="Invoice limit reached"
              >
                <Plus size={18} /> <span className="hidden sm:inline">New {type === 'quotation' ? 'Quotation' : 'Invoice'}</span>
              </button>
            ) : (
              <Link 
                href={type === 'quotation' ? "/app/quotations/new" : "/app/invoices/new"} 
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap"
              >
                <Plus size={18} /> <span className="hidden sm:inline">New {type === 'quotation' ? 'Quotation' : 'Invoice'}</span>
              </Link>
            )}`;

content = content.replace(searchNewBtn, replacementNewBtn);

const searchBanner = `{/* Header Section */}`;
const replacementBanner = `{isLimitReached && (
        <div className="mb-4 bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 flex items-center justify-between font-medium text-sm w-full max-w-7xl mx-auto">
          <span>You have reached your plan's invoice limit. Please upgrade your subscription to create more invoices.</span>
          <Link href="/app/settings?tab=pricing" className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-700 transition-colors font-semibold">
            Upgrade Plan
          </Link>
        </div>
      )}
      {/* Header Section */}`;

content = content.replace(searchBanner, replacementBanner);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
