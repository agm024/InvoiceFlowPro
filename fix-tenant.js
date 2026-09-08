const fs = require('fs');
let payPage = fs.readFileSync('app/pay/[id]/page.tsx', 'utf8');

payPage = payPage.replace(
  'companySettings = await prisma.companySettings.findFirst()',
  'companySettings = null // Do not leak other company settings!'
);

fs.writeFileSync('app/pay/[id]/page.tsx', payPage, 'utf8');

let statementPage = fs.readFileSync('app/statement/[clientId]/page.tsx', 'utf8');

statementPage = statementPage.replace(
  'const companySettings = await prisma.companySettings.findFirst()',
  'const companySettings = await prisma.companySettings.findUnique({ where: { companyId: client.companyId } })'
);

fs.writeFileSync('app/statement/[clientId]/page.tsx', statementPage, 'utf8');

