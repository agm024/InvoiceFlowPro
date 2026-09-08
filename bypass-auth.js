const fs = require('fs');
let file = fs.readFileSync('lib/auth-context.ts', 'utf8');

file = file.replace(
  /const BYPASS_AUTH = false;/,
  `const BYPASS_AUTH = true;`
);

fs.writeFileSync('lib/auth-context.ts', file, 'utf8');
