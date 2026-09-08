const fs = require('fs');

let actions = fs.readFileSync('app/app/settings/profile-actions.ts', 'utf8');
actions = actions.replace(
  /if \(user\.role !== 'owner'\) return \{ error: 'Only the company owner can delete the account' \}/,
  `if (user.role !== 'owner' && user.role !== 'admin') return { error: 'Only the company owner/admin can delete the account' }`
);
fs.writeFileSync('app/app/settings/profile-actions.ts', actions, 'utf8');

let onboarding = fs.readFileSync('app/onboarding/actions.ts', 'utf8');
onboarding = onboarding.replace(
  /role: 'admin',/,
  `role: 'owner',`
);
fs.writeFileSync('app/onboarding/actions.ts', onboarding, 'utf8');
