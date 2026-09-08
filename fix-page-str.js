const fs = require('fs');
let page = fs.readFileSync('app/app/page.tsx', 'utf8');

page = page.replace(
  /const hasBusinessInfo = Boolean\(company\?\.settings\?\.address \|\| company\?\.address\);/,
  `const getStr = (s: string | null | undefined) => (s || '').trim();
  const hasBusinessInfo = Boolean(getStr(company?.settings?.address) || getStr(company?.address));`
);

page = page.replace(
  /const hasGst = Boolean\(company\?\.settings\?\.gstin \|\| company\?\.gstin \|\| company\?\.settings\?\.panNo \|\| company\?\.pan\);/,
  `const hasGst = Boolean(getStr(company?.settings?.gstin) || getStr(company?.gstin) || getStr(company?.settings?.panNo) || getStr(company?.pan));`
);

fs.writeFileSync('app/app/page.tsx', page, 'utf8');
