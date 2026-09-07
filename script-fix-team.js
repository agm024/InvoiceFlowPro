const fs = require('fs');
let text = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');

text = text.replace(
    /await checkFeatureLimit\(companyId, 'user'\)/g,
    `await checkFeatureLimit(companyId, 'team_member')`
);

fs.writeFileSync('app/app/settings/team-actions.ts', text, 'utf8');
