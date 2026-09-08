const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(/\$10,400/g, '₹10,400');

fs.writeFileSync('app/page.tsx', page, 'utf8');

