const fs = require('fs');
let file = 'app/app/invoices/InvoiceListClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// The logic string that was injected:
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

// It was injected around useEffect.
content = content.replace(handleBulkDeleteLogic, '');

// Also there was a `\n  return (` inserted but we want to restore original or keep it.
// Let's just do a string replace of the exact chunk.
let chunkToRemove = `  const handleBulkDelete = async () => {
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
  };\n\n`;

content = content.replace(chunkToRemove, '');

// Now we insert it right before the final `return (`
// Let's find `  return (` that starts the main JSX.
// We know it's right after `const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)` or something similar.
// Let's just find the first `  return (` that doesn't have `=>` before it.
// To be extremely safe, we will just place it right after `const confirmDelete = (id: string) => { ... }`

content = content.replace(
  /  const confirmDelete = \(id: string\) => \{/,
  handleBulkDeleteLogic + '\n  const confirmDelete = (id: string) => {'
);

fs.writeFileSync(file, content, 'utf8');
