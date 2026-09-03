const fs = require('fs');
let actions = fs.readFileSync('app/invite/actions.ts', 'utf8');
actions = actions.replace('companyId: invitation.companyId,', 'companyId: invitation.companyId!,');
fs.writeFileSync('app/invite/actions.ts', actions, 'utf8');
