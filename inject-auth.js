const fs = require('fs');

function injectAuth(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('requireCompany')) {
    content = content.replace(/export default async function[^{]+\{\n/, 
      "import { requireCompany } from '@/lib/auth-context'\n\n$&  const { companyId } = await requireCompany()\n"
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected auth into ${file}`);
  }
}

injectAuth('app/app/projects/new/page.tsx');
injectAuth('app/app/projects/page.tsx');
injectAuth('app/app/invoices/[id]/edit/page.tsx');

