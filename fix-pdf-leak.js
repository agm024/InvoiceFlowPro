const fs = require('fs');

let invoicePdfPage = fs.readFileSync('app/pay/[id]/invoice/page.tsx', 'utf8');

invoicePdfPage = invoicePdfPage.replace(
  'companySettings = await prisma.companySettings.findFirst()',
  'companySettings = null'
);

fs.writeFileSync('app/pay/[id]/invoice/page.tsx', invoicePdfPage, 'utf8');

