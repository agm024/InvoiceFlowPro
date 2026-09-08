const fs = require('fs');

let authContext = fs.readFileSync('lib/auth-context.ts', 'utf8');
authContext = authContext.replace('const BYPASS_AUTH = true;', 'const BYPASS_AUTH = false;');
fs.writeFileSync('lib/auth-context.ts', authContext, 'utf8');

console.log('Disabled BYPASS_AUTH');
