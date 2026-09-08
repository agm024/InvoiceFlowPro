const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// Update box text / tagline
page = page.replace(
  'invoice.siteradiant.co.in/app is now live',
  'Create, Manage & Track Invoices — All in One Place'
);

// Update currency symbols in mock screen
page = page.replace(/\$45,231/g, '₹45,231');
page = page.replace(/\$32,100/g, '₹32,100');
page = page.replace(/\$12,400/g, '₹12,400');
page = page.replace(/\$13,131/g, '₹13,131');

fs.writeFileSync('app/page.tsx', page, 'utf8');

