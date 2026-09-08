const fs = require('fs');

let portalPage = fs.readFileSync('app/portal/[portalToken]/page.tsx', 'utf8');

portalPage = portalPage.replace(
  'const companySettings = await prisma.companySettings.findFirst()',
  'const companySettings = await prisma.companySettings.findUnique({ where: { companyId: client.companyId } })'
);

fs.writeFileSync('app/portal/[portalToken]/page.tsx', portalPage, 'utf8');

