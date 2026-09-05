const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

const searchBtn1 = /<button[\s\S]*?onClick=\{\(\) => setSubmitAction\('sent_and_print'\)\}[\s\S]*?<\/button>/;
const replacementBtn1 = `
            {isLimitReached && !existingInvoice ? (
              <div className="flex-1 bg-red-100 text-red-600 rounded-xl py-3.5 font-bold text-center border border-red-200">
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
            )}
`;

content = content.replace(searchBtn1, replacementBtn1);

const searchBtn2 = /<button[\s\S]*?onClick=\{\(\) => setSubmitAction\('draft'\)\}[\s\S]*?<\/button>/;
const replacementBtn2 = `
            {isLimitReached && !existingInvoice ? null : (
              <button 
                type="submit" 
                onClick={() => setSubmitAction('draft')}
                className="flex-1 bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-xl py-3.5 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
              >
                {existingInvoice ? 'Update' : 'Save Draft'}
              </button>
            )}
`;

content = content.replace(searchBtn2, replacementBtn2);

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
