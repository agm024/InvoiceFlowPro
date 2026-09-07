const fs = require('fs');
let text = fs.readFileSync('app/app/estimates/actions.ts', 'utf8');

text = text.replace(
    /await checkFeatureLimit\(companyId, 'invoice'\)/g,
    `await checkFeatureLimit(companyId, 'estimate')`
);

fs.writeFileSync('app/app/estimates/actions.ts', text, 'utf8');
