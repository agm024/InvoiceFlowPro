const fs = require('fs');
let content = fs.readFileSync('app/app/page.tsx', 'utf8');

content = content.replace(
  'const gstBalance = gstLiability - gstPaid',
  'const gstBalance = Math.max(0, gstLiability - gstPaid)'
);

fs.writeFileSync('app/app/page.tsx', content, 'utf8');

