const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

const search = `<Link 
              href={type === 'quotation' ? '/quotations/new' : '/invoices/new'} 
              className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm shadow-zinc-900/20"
            >
              <Plus size={18} /> Create {type === 'quotation' ? 'Quotation' : 'Invoice'}
            </Link>`;

const replace = `{isLimitReached ? (
              <button disabled className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm cursor-not-allowed">
                <Plus size={18} /> Limit Reached
              </button>
            ) : (
              <Link 
                href={type === 'quotation' ? '/app/quotations/new' : '/app/invoices/new'} 
                className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm shadow-zinc-900/20"
              >
                <Plus size={18} /> Create {type === 'quotation' ? 'Quotation' : 'Invoice'}
              </Link>
            )}`;

content = content.replace(search, replace);
fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
