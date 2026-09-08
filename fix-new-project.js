const fs = require('fs');

let p1 = fs.readFileSync('app/app/projects/new/page.tsx', 'utf8');
p1 = p1.replace("const initialClientId = resolvedParams.clientId || '';", "const initialClientId = resolvedParams.clientId || '';\n  const { companyId } = await requireCompany();");
fs.writeFileSync('app/app/projects/new/page.tsx', p1, 'utf8');

console.log('Fixed projects new page.');
