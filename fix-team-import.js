const fs = require('fs');
let text = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');

if (!text.includes("import { checkFeatureLimit }")) {
    text = "import { checkFeatureLimit } from '@/lib/billing'\n" + text;
    fs.writeFileSync('app/app/settings/team-actions.ts', text, 'utf8');
}
