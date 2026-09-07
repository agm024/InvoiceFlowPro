const fs = require('fs');
let teamActions = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');
teamActions = teamActions.replace(
  /await prisma\.user\.update\(\{\s+where:\s*\{\s*id,\s*companyId\s*\},\s+data:\s*\{\s*customRoleId:\s*null,\s*role:\s*'member'\s*\}\s*\}\)/g,
  `await prisma.user.delete({ where: { id, companyId } })`
);
fs.writeFileSync('app/app/settings/team-actions.ts', teamActions, 'utf8');
