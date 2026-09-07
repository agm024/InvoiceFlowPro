const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/InvoiceListClient.tsx', 'utf8');

// Imports
content = content.replace(
  `import { deleteInvoice } from './actions'`,
  `import { deleteInvoice, deleteInvoices } from './actions'`
);

// State
content = content.replace(
  `const [isDeleting, setIsDeleting] = useState(false)`,
  `const [isDeleting, setIsDeleting] = useState(false)\n  const [selectedIds, setSelectedIds] = useState<string[]>([])`
);

// Bulk delete handler
const handlersSearch = `const handleDelete = async (id: string) => {`;
const handlersReplace = `const handleBulkDelete = async () => {
    if (confirm(\`Are you sure you want to delete \${selectedIds.length} items? This action cannot be undone.\`)) {
      setIsDeleting(true)
      const res = await deleteInvoices(selectedIds)
      setIsDeleting(false)
      if (res.success) {
        setInvoices(invoices.filter(inv => !selectedIds.includes(inv.id)))
        setSelectedIds([])
        toast.success('Successfully deleted')
      } else {
        toast.error(res.error || 'Failed to delete')
      }
    }
  }

  const handleDelete = async (id: string) => {`;
content = content.replace(handlersSearch, handlersReplace);

// Table Header
const thSearch = `<th className="py-4 px-6 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Number</th>`;
const thReplace = `<th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.length === paginatedInvoices.length && paginatedInvoices.length > 0} onChange={(e) => { if (e.target.checked) setSelectedIds(paginatedInvoices.map(i => i.id)); else setSelectedIds([]); }} /></th>\n                  <th className="py-4 px-6 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Number</th>`;
content = content.replace(thSearch, thReplace);

// Table Row
const tdSearch = `<td className="py-4 px-6 whitespace-nowrap">`;
const tdReplace = `<td className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" checked={selectedIds.includes(invoice.id)} onChange={(e) => { if (e.target.checked) setSelectedIds([...selectedIds, invoice.id]); else setSelectedIds(selectedIds.filter(id => id !== invoice.id)); }} /></td>\n                    <td className="py-4 px-6 whitespace-nowrap">`;
content = content.replace(tdSearch, tdReplace);

// Bulk actions bar
const filterBarSearch = `{/* Filter Bar */}`;
const filterBarReplace = `{selectedIds.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 px-6 py-3 mx-6 mt-6 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <span className="font-medium">{selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected</span>
          <button onClick={handleBulkDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <Trash2 size={16} /> Delete Selected
          </button>
        </div>
      )}\n\n      {/* Filter Bar */}`;
content = content.replace(filterBarSearch, filterBarReplace);

// Include Trash2 in lucide imports if not there
if (!content.includes(', Trash2,')) {
    content = content.replace('X, Mail, Receipt }', 'X, Mail, Receipt, Trash2 }');
}

fs.writeFileSync('app/app/invoices/InvoiceListClient.tsx', content, 'utf8');
