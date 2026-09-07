const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/actions.ts', 'utf8');

content = content.replace(
  `import { requireCompany } from '@/lib/auth-context'`,
  `import { requireCompany, requireWriteAccess } from '@/lib/auth-context'`
);

content = content.replace(
  /export async function createInvoice\([\s\S]*?\{[\s\S]*?const \{ companyId \} = await requireCompany\(\)/,
  (match) => match + `\n  await requireWriteAccess()`
);

content = content.replace(
  /export async function updateInvoice\([\s\S]*?\{[\s\S]*?const \{ companyId \} = await requireCompany\(\)/,
  (match) => match + `\n  await requireWriteAccess()`
);

content = content.replace(
  /export async function deleteInvoice\([\s\S]*?\{[\s\S]*?const \{ companyId \} = await requireCompany\(\)/,
  (match) => match + `\n  await requireWriteAccess()`
);

fs.writeFileSync('app/app/invoices/actions.ts', content, 'utf8');
