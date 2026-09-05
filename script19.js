const fs = require('fs');
let actions = fs.readFileSync('app/invite/actions.ts', 'utf8');
actions = actions.replace('customRoleId: invitation.customRoleId', 'customRoleId: invitation.customRoleId || undefined');
fs.writeFileSync('app/invite/actions.ts', actions, 'utf8');

let page = fs.readFileSync('app/invite/page.tsx', 'utf8');
page = page.replace('if (res.error) {', 'if (res?.error) {');
page = page.replace('setError(res.error)', 'setError(res?.error)');
fs.writeFileSync('app/invite/page.tsx', page, 'utf8');
