const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/actions.ts', 'utf8');

content = content.replace(
  `import { requireCompany } from '@/lib/auth-context'`,
  `import { requireCompany, requireWriteAccess } from '@/lib/auth-context'`
);

content = content.replace(
  /const \{ companyId \} = await requireCompany\(\)/g,
  `const { companyId } = await requireCompany()\n  await requireWriteAccess()`
);

fs.writeFileSync('app/app/invoices/[id]/actions.ts', content, 'utf8');
