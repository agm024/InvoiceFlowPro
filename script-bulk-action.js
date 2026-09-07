const fs = require('fs');
let file = 'app/app/invoices/InvoiceListClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert handleBulkDelete
const handleBulkDeleteLogic = `
  const handleBulkDelete = async () => {
    if (!confirm('Are you sure you want to delete ' + selectedIds.length + ' item(s)?')) return;
    setIsDeleting(true);
    const result = await deleteInvoices(selectedIds);
    if (result.success) {
      toast.success('Successfully deleted ' + selectedIds.length + ' item(s)');
      setInvoices(invoices.filter(i => !selectedIds.includes(i.id)));
      setSelectedIds([]);
    } else {
      toast.error(result.error || 'Failed to delete items');
    }
    setIsDeleting(false);
  };
`;
// Put it right before return (
content = content.replace(
  /  return \(/,
  handleBulkDeleteLogic + '\n  return ('
);

// Insert the action bar right above {/* Search & Filters Bar */}
const actionBarHtml = `
      {selectedIds.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30 p-4 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <span className="text-red-600 dark:text-red-400 font-medium text-sm">
              {selectedIds.length} {type === 'quotation' ? 'estimate' : 'invoice'}(s) selected
            </span>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-red-600/70 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 text-sm font-medium"
            >
              Clear
            </button>
          </div>
          <button 
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}
`;

content = content.replace(
  /        \{\/\* Search & Filters Bar \*\/\}/,
  actionBarHtml + '\n        {/* Search & Filters Bar */}'
);

fs.writeFileSync(file, content, 'utf8');
