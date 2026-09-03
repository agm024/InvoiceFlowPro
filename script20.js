const fs = require('fs');

// Fix actions.ts
let actions = fs.readFileSync('app/invite/actions.ts', 'utf8');
actions = actions.replace('customRoleId: invitation.customRoleId || undefined', 'customRoleId: invitation.customRoleId || null');
actions = actions.replace('customRoleId: invitation.customRoleId', 'customRoleId: invitation.customRoleId || null');
fs.writeFileSync('app/invite/actions.ts', actions, 'utf8');

// Fix page.tsx
let page = fs.readFileSync('app/invite/page.tsx', 'utf8');
page = page.replace('if (res?.error) {', 'if (res && res.error) {');
page = page.replace('if (res.error) {', 'if (res && res.error) {');
page = page.replace('setError(res?.error)', 'setError(res.error)');
fs.writeFileSync('app/invite/page.tsx', page, 'utf8');
