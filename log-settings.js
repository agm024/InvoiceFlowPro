const fs = require('fs');
let file = fs.readFileSync('app/app/settings/actions.ts', 'utf8');

file = file.replace(
  /console\.error\('Failed to update settings:', error\)/,
  `console.error('Failed to update settings:', error)`
);

fs.writeFileSync('app/app/settings/actions.ts', file, 'utf8');
