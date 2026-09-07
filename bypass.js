const fs = require('fs');
let text = fs.readFileSync('lib/auth-context.ts', 'utf8');

text = text.replace(
    /const BYPASS_AUTH = .*/,
    "const BYPASS_AUTH = true; // BYPASS_AUTH TEMPORARILY ENABLED"
);

fs.writeFileSync('lib/auth-context.ts', text, 'utf8');
