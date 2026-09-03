const fs = require('fs');
let actions = fs.readFileSync('app/invite/actions.ts', 'utf8');
actions = actions.replace('customRoleId: invitation.customRoleId || undefined', 'customRoleId: invitation.customRoleId ?? undefined');
fs.writeFileSync('app/invite/actions.ts', actions, 'utf8');
