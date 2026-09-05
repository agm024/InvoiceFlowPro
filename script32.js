const fs = require('fs');
let content = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');

content = content.replace(
  "import { requireCompany } from '@/lib/auth-context'",
  "import { requireCompany, requireWriteAccess } from '@/lib/auth-context'"
);

fs.writeFileSync('app/app/settings/profile-actions.ts', content, 'utf8');
