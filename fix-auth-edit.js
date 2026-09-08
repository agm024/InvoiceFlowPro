const fs = require('fs');
let content = fs.readFileSync('app/app/invoices/[id]/edit/page.tsx', 'utf8');

if (!content.includes('requireCompany')) {
  content = `import { requireCompany } from '@/lib/auth-context'\n` + content;
  content = content.replace('const { id } = await params\n', 'const { id } = await params\n  const { companyId } = await requireCompany()\n');
  fs.writeFileSync('app/app/invoices/[id]/edit/page.tsx', content, 'utf8');
}

let p1 = fs.readFileSync('app/app/projects/new/page.tsx', 'utf8');
if (p1.includes('requireCompany') && p1.includes('export default async function')) {
  // wait, the previous injectAuth worked for projects? Let's check
}
