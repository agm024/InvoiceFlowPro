const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/**/actions.ts');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('requireWriteAccess')) {
    content = content.replace(
      `import { requireCompany } from '@/lib/auth-context'`,
      `import { requireCompany, requireWriteAccess } from '@/lib/auth-context'`
    );
  }

  // Inject await requireWriteAccess() after requireCompany()
  content = content.replace(
    /const \{ companyId \} = await requireCompany\(\)\r?\n/g,
    `const { companyId } = await requireCompany()\n    await requireWriteAccess()\n`
  );

  fs.writeFileSync(file, content, 'utf8');
}
