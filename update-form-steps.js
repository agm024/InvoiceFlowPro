const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

// Add "Step 1: Customer Details"
content = content.replace(
  '<div className="bg-card dark:bg-card-dark p-5 md:p-8 rounded-2xl shadow-sm border border-card-border mb-6">',
  '<div className="bg-card dark:bg-card-dark p-5 md:p-8 rounded-2xl shadow-sm border border-card-border mb-6">\n          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">1</span> Customer Details</h2>'
);

// Add "Step 2: Invoice Details"
content = content.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">',
  '<h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-2 mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800"><span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">2</span> Invoice Details</h2>\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">'
);

// Add "Step 3: Items & Tax"
content = content.replace(
  '<div className="bg-card dark:bg-card-dark rounded-2xl shadow-sm border border-card-border overflow-hidden mb-6">',
  '<div className="bg-card dark:bg-card-dark rounded-2xl shadow-sm border border-card-border overflow-hidden mb-6">\n          <div className="p-5 md:p-8 pb-0">\n             <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">3</span> Items & Tax</h2>\n          </div>'
);

// Add "Step 4: Additional Details"
content = content.replace(
  '<div className="bg-card dark:bg-card-dark p-5 md:p-8 rounded-2xl shadow-sm border border-card-border mb-6">',
  '<div className="bg-card dark:bg-card-dark p-5 md:p-8 rounded-2xl shadow-sm border border-card-border mb-6">\n          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">4</span> Additional Details</h2>'
);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
