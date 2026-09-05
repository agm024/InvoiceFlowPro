const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

// 1. Add isLimitReached prop
content = content.replace(/companySettings\r?\n\}:\s*\{/, 'companySettings,\n  isLimitReached\n}: {');
content = content.replace(/companySettings\?:\s*any\r?\n\}\)\s*\{/, 'companySettings?: any,\n  isLimitReached?: boolean\n}) {');

// 2. Fix toast.error
content = content.replace("toast.error('Error saving document')", "toast.error(res.error || 'Error saving document')");

// 3. Disable buttons
const searchSaveBtn = `<button 
              type="submit" 
              onClick={() => setSubmitAction('draft')}
              className="flex-1 bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-xl py-3.5 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              {existingInvoice ? 'Update' : 'Save Draft'}
            </button>`;

const replacementSaveBtn = `{isLimitReached && !existingInvoice ? null : (
              <button 
                type="submit" 
                onClick={() => setSubmitAction('draft')}
                className="flex-1 bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-xl py-3.5 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                {existingInvoice ? 'Update' : 'Save Draft'}
              </button>
            )}`;

content = content.replace(searchSaveBtn, replacementSaveBtn);

const searchPrintBtn = `<button 
              type="submit" 
              onClick={() => setSubmitAction('sent_and_print')}
              className="flex-1 bg-black text-white dark:bg-white dark:text-zinc-900 rounded-xl py-3.5 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10"
            >
              {existingInvoice ? 'Update & Print' : 'Save & Print'}
            </button>`;

const replacementPrintBtn = `{isLimitReached && !existingInvoice ? (
              <div className="flex-1 bg-red-100 text-red-600 rounded-xl py-3.5 font-bold text-center border border-red-200 flex items-center justify-center">
                Invoice Limit Reached
              </div>
            ) : (
              <button 
                type="submit" 
                onClick={() => setSubmitAction('sent_and_print')}
                className="flex-1 bg-black text-white dark:bg-white dark:text-zinc-900 rounded-xl py-3.5 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10"
              >
                {existingInvoice ? 'Update & Print' : 'Save & Print'}
              </button>
            )}`;

content = content.replace(searchPrintBtn, replacementPrintBtn);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
