const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/actions.ts', 'utf8');

content = content.replace(
  /export async function getInvoiceDetails[\s\S]*?await requireWriteAccess\(\)/,
  (match) => match.replace(`\n  await requireWriteAccess()`, '')
);

fs.writeFileSync('app/app/invoices/[id]/actions.ts', content, 'utf8');
