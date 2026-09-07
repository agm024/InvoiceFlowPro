const fs = require('fs');
let text = fs.readFileSync('app/app/settings/team-actions.ts', 'utf8');

text = text.replace("import { checkFeatureLimit } from '@/lib/billing'\n\"use server\"", '"use server"\nimport { checkFeatureLimit } from \'@/lib/billing\'');
text = text.replace("import { checkFeatureLimit } from '@/lib/billing'\n'use server'", "'use server'\nimport { checkFeatureLimit } from \'@/lib/billing\'");

fs.writeFileSync('app/app/settings/team-actions.ts', text, 'utf8');
