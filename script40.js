const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');

content = content.replace(
  'export default function ClientsClient({ initialClients }: { initialClients: Client[] }) {',
  'export default function ClientsClient({ initialClients, isLimitReached }: { initialClients: Client[], isLimitReached?: boolean }) {'
);

const searchLink = `<Link 
              href="/app/clients/new" 
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-2 shrink-0"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Add Client</span>
            </Link>`;

const replacementLink = `{isLimitReached ? (
              <button 
                disabled
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 shrink-0 cursor-not-allowed"
                title="Client limit reached"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Add Client</span>
              </button>
            ) : (
              <Link 
                href="/app/clients/new" 
                className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-2 shrink-0"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Add Client</span>
              </Link>
            )}`;

content = content.replace(searchLink, replacementLink);
fs.writeFileSync('app/app/clients/ClientsClient.tsx', content, 'utf8');
