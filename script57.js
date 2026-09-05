const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/new/InvoiceForm.tsx', 'utf8');

content = content.replace(/<button type="submit" onClick=\{\(\) => setSubmitAction\('([a-z_]+)'\)\} className="/g, '<button type="submit" onClick={() => setSubmitAction(\'$1\')} disabled={isSubmitting} className="');

fs.writeFileSync('app/app/invoices/new/InvoiceForm.tsx', content, 'utf8');
