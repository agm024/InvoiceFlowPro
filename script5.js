const fs = require('fs');
const path = 'app/app/invoices/[id]/InvoiceActionsDropdown.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex1 = /if \(!window\.confirm\(`Are you sure you want to send a payment reminder to \$\{clientEmail\}\?`\)\) return;/g;
const regex2 = /if \(!window\.confirm\(`Are you sure you want to send this invoice to \$\{clientEmail\}\?`\)\) return;/g;

content = content.replace(regex1, "setModalState({ isOpen: true, type: 'reminder' }); return;");
content = content.replace(regex2, "setModalState({ isOpen: true, type: 'send' }); return;");

fs.writeFileSync(path, content, 'utf8');
