const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('requireCompany')) {
    content = `import { requireCompany } from '@/lib/auth-context'\n` + content;
    content = content.replace(/export default async function\s+\w+\(\)\s*\{/, `$& \n  const { companyId } = await requireCompany();\n`);
    fs.writeFileSync(file, content, 'utf8');
  }
}

fix('app/app/projects/page.tsx');
fix('app/app/projects/new/page.tsx');
