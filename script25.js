const fs = require('fs');
let actions = fs.readFileSync('app/invite/actions.ts', 'utf8');
actions = actions.replace('customRoleId: invitation.customRoleId === null ? undefined : invitation.customRoleId', 'customRoleId: (invitation.customRoleId || undefined) as string | undefined');
fs.writeFileSync('app/invite/actions.ts', actions, 'utf8');
