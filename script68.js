const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/**/*.ts');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const mutatingKeywords = ['create', 'update', 'delete', 'cancel', 'issue', 'record', 'save'];
  
  // Find all exported async functions
  const regex = /export async function\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const funcName = match[1];
    const funcBody = match[3];

    // Check if it's a mutating function
    const isMutating = mutatingKeywords.some(kw => funcName.toLowerCase().includes(kw));

    if (isMutating && funcBody.includes('requireCompany()') && !funcBody.includes('requireWriteAccess()')) {
      const replacementBody = funcBody.replace(
        /const \{ companyId \} = await requireCompany\(\)\r?\n/,
        `const { companyId } = await requireCompany()\n  await requireWriteAccess()\n`
      );
      content = content.replace(funcBody, replacementBody);
      changed = true;
    }
  }

  if (changed) {
    if (!content.includes('requireWriteAccess')) {
      content = content.replace(
        `import { requireCompany }`,
        `import { requireCompany, requireWriteAccess }`
      );
    }
    fs.writeFileSync(file, content, 'utf8');
  }
}
