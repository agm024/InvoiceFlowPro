const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// For desktop empty state
const emptyBtnSearch = `<Link href="/app/invoices/new" className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 text-sm">
              <Plus size={16} /> Create
            </Link>`;
const emptyBtnReplace = `{isLimitReached ? (
              <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 text-sm cursor-not-allowed">
                <Plus size={16} /> Limit Reached
              </button>
            ) : (
              <Link href="/app/invoices/new" className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 text-sm">
                <Plus size={16} /> Create
              </Link>
            )}`;
content = content.replace(emptyBtnSearch, emptyBtnReplace);

// For mobile/table empty state
const emptyBtnTableSearch = `<Link href="/app/invoices/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                      <Plus size={18} /> Create Invoice
                    </Link>`;
const emptyBtnTableReplace = `{isLimitReached ? (
                      <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 cursor-not-allowed">
                        <Plus size={18} /> Limit Reached
                      </button>
                    ) : (
                      <Link href="/app/invoices/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                        <Plus size={18} /> Create Invoice
                      </Link>
                    )}`;
content = content.replace(emptyBtnTableSearch, emptyBtnTableReplace);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');

let clients = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');
const clientEmptySearch = `<Link href="/app/clients/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
            <Plus size={18} /> Create your first client
          </Link>`;
const clientEmptyReplace = `{isLimitReached ? (
            <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 cursor-not-allowed">
              <Plus size={18} /> Limit Reached
            </button>
          ) : (
            <Link href="/app/clients/new" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
              <Plus size={18} /> Create your first client
            </Link>
          )}`;
clients = clients.replace(clientEmptySearch, clientEmptyReplace);
fs.writeFileSync('app/app/clients/ClientsClient.tsx', clients, 'utf8');
