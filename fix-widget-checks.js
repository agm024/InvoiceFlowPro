const fs = require('fs');
let page = fs.readFileSync('app/app/page.tsx', 'utf8');

page = page.replace(
  /const company = await prisma\.company\.findUnique\(\{ where: \{ id: companyId \} \}\);/,
  `const company = await prisma.company.findUnique({ where: { id: companyId }, include: { settings: true } });`
);

page = page.replace(
  /const hasBusinessInfo = Boolean\(company\?\.address && company\?\.city\);/,
  `const hasBusinessInfo = Boolean(company?.settings?.address || company?.address);`
);

page = page.replace(
  /const hasGst = Boolean\(company\?\.gstin\);/,
  `const hasGst = Boolean(company?.settings?.gstin || company?.gstin || company?.settings?.panNo || company?.pan);`
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');
