const fs = require('fs');
let content = fs.readFileSync('app/app/clients/ClientsClient.tsx', 'utf8');

// Imports
content = content.replace(
  `import { Search, Plus, Mail, Phone, MapPin, MoreVertical, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react'`,
  `import { Search, Plus, Mail, Phone, MapPin, MoreVertical, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react'\nimport UpgradeModal from '@/components/UpgradeModal'`
);

// State
content = content.replace(
  `const [isDeleting, setIsDeleting] = useState(false)`,
  `const [isDeleting, setIsDeleting] = useState(false)\n  const [showUpgradeModal, setShowUpgradeModal] = useState(false)`
);

// Replace button in header
content = content.replace(
  /<button disabled className="(.*?)cursor-not-allowed"(.*?)>\s*<Plus size=\{18\} \/> <span className="hidden sm:inline">Not Allowed<\/span>\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 flex-1 sm:flex-none justify-center whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={18} /> <span className="hidden sm:inline">Upgrade Plan</span></button>`
);

// Replace empty state
content = content.replace(
  /<button disabled className="bg-zinc-200 dark:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 cursor-not-allowed">\s*<Plus size=\{18\} \/> Limit Reached\s*<\/button>/g,
  `<button onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all"><Plus size={18} /> Upgrade Plan</button>`
);

// Render modal
content = content.replace(
  /\{deleteModalOpen && \(/,
  `<UpgradeModal \n        isOpen={showUpgradeModal} \n        onClose={() => setShowUpgradeModal(false)} \n        title="Client Limit Reached" \n        message="You have reached the maximum number of clients allowed on your current plan. Upgrade your plan to add more clients." \n      />\n\n      {deleteModalOpen && (`
);

fs.writeFileSync('app/app/clients/ClientsClient.tsx', content, 'utf8');
