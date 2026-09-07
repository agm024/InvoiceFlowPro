const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// Imports
content = content.replace(
  `import { Search, Plus, FileText, ChevronDown, Eye, CheckCircle2, XCircle, ArrowRight, Download, Filter, Receipt, Copy, ExternalLink, Calendar, Banknote } from 'lucide-react'`,
  `import { Search, Plus, FileText, ChevronDown, Eye, CheckCircle2, XCircle, ArrowRight, Download, Filter, Receipt, Copy, ExternalLink, Calendar, Banknote } from 'lucide-react'\nimport UpgradeModal from '@/components/UpgradeModal'`
);

// State
content = content.replace(
  `const [deleteId, setDeleteId] = useState<string | null>(null)`,
  `const [deleteId, setDeleteId] = useState<string | null>(null)\n  const [showUpgradeModal, setShowUpgradeModal] = useState(false)`
);

// Top button replacement
const searchTopBtn = `{isLimitReached ? (
              <button disabled className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm cursor-not-allowed">
                <Plus size={18} /> Limit Reached
              </button>
            ) : (`;

const replaceTopBtn = `{isLimitReached ? (
              <button onClick={() => setShowUpgradeModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all">
                <Plus size={18} /> Upgrade Plan
              </button>
            ) : (`;

content = content.replace(searchTopBtn, replaceTopBtn);

// Empty state replacements (desktop)
const searchEmptyBtn = `{isLimitReached ? (
              <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-5 py-2.5 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 text-sm cursor-not-allowed">
                <Plus size={16} /> Limit Reached
              </button>
            ) : (`;

const replaceEmptyBtn = `{isLimitReached ? (
              <button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 text-sm">
                <Plus size={16} /> Upgrade Plan
              </button>
            ) : (`;

content = content.replace(searchEmptyBtn, replaceEmptyBtn);

// Empty state replacements (mobile/table)
const searchTableBtn = `{isLimitReached ? (
                      <button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 cursor-not-allowed">
                        <Plus size={18} /> Limit Reached
                      </button>
                    ) : (`;

const replaceTableBtn = `{isLimitReached ? (
                      <button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                        <Plus size={18} /> Upgrade Plan
                      </button>
                    ) : (`;

content = content.replace(searchTableBtn, replaceTableBtn);

// Render modal
content = content.replace(
  `{deleteId && (`,
  `<UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        title={type === 'quotation' ? "Estimate Limit Reached" : "Invoice Limit Reached"} 
        message={type === 'quotation' ? "You have reached the maximum number of estimates allowed on your current plan. Upgrade your plan to create more." : "You have reached the maximum number of invoices allowed on your current plan. Upgrade your plan to create more."} 
      />\n\n      {deleteId && (`
);

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
