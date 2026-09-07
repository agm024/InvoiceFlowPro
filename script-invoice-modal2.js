const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// Imports
content = content.replace(
  `import { Search, Plus, FileText, ChevronDown, Eye, CheckCircle2, XCircle, ArrowRight, Download, Filter, Receipt, Copy, ExternalLink, Calendar, Banknote } from 'lucide-react'`,
  `import { Search, Plus, FileText, ChevronDown, Eye, CheckCircle2, XCircle, ArrowRight, Download, Filter, Receipt, Copy, ExternalLink, Calendar, Banknote } from 'lucide-react'\nimport UpgradeModal from '@/components/UpgradeModal'`
);

// State
content = content.replace(
  `const [isDeleting, setIsDeleting] = useState(false)`,
  `const [isDeleting, setIsDeleting] = useState(false)\n  const [showUpgradeModal, setShowUpgradeModal] = useState(false)`
);

// Top button replacement
const searchTopBtn = `{isLimitReached ? (
              <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap cursor-not-allowed">
                <Plus size={18} /> <span className="hidden sm:inline">Not Allowed</span>
              </button>
            ) : (`;

const replaceTopBtn = `{isLimitReached ? (
              <button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all">
                <Plus size={18} /> <span className="hidden sm:inline">Upgrade Plan</span>
              </button>
            ) : (`;

content = content.replace(searchTopBtn, replaceTopBtn);

// Wait, let's just do a regex replace on all the limit reached buttons because I might have the exact string wrong.
content = content.replace(
  /<button disabled className="(.*?)cursor-not-allowed"(.*?)>\s*<Plus size=\{18\} \/> <span className="hidden sm:inline">Not Allowed<\/span>\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={18} /> <span className="hidden sm:inline">Upgrade Plan</span></button>`
);

content = content.replace(
  /<button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 text-sm cursor-not-allowed">\s*<Plus size=\{16\} \/> Limit Reached\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 text-sm hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={16} /> Upgrade Plan</button>`
);

content = content.replace(
  /<button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 cursor-not-allowed">\s*<Plus size=\{18\} \/> Limit Reached\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={18} /> Upgrade Plan</button>`
);

// Second top button in header (different style)
content = content.replace(
  /<button disabled className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm cursor-not-allowed">\s*<Plus size=\{18\} \/> Limit Reached\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={18} /> Upgrade Plan</button>`
);

// Render modal
content = content.replace(
  /\{deleteModalOpen && \(/,
  `<UpgradeModal \n        isOpen={showUpgradeModal} \n        onClose={() => setShowUpgradeModal(false)} \n        title={type === 'quotation' ? "Estimate Limit Reached" : "Invoice Limit Reached"} \n        message={type === 'quotation' ? "You have reached the maximum number of estimates allowed on your current plan. Upgrade your plan to create more." : "You have reached the maximum number of invoices allowed on your current plan. Upgrade your plan to create more."} \n      />\n\n      {deleteModalOpen && (`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
