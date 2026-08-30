const fs = require('fs');

const file = 'app/(admin)/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\?\{totalRevenue/g, "₹{totalRevenue");
content = content.replace(/\?\{intlRevenue/g, "₹{intlRevenue");
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed rupee symbols in Admin');
