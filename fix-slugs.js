const fs = require('fs');

let actions = fs.readFileSync('app/app/clients/actions.ts', 'utf8');
actions = actions.replace(
  /const existing = await model\.findFirst\(\{ where: \{ slug, companyId \} \}\)/,
  `const existing = await model.findFirst({ where: { slug } })`
);
fs.writeFileSync('app/app/clients/actions.ts', actions, 'utf8');

// Do the same for products
let productActions = fs.readFileSync('app/app/products/actions.ts', 'utf8');
productActions = productActions.replace(
  /const existing = await model\.findFirst\(\{ where: \{ slug, companyId \} \}\)/,
  `const existing = await model.findFirst({ where: { slug } })`
);
fs.writeFileSync('app/app/products/actions.ts', productActions, 'utf8');
