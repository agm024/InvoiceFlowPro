const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

content = content.replace(
  '  subscription: any\n  currentUser: any\n}) {',
  '  subscription: any\n  currentUser: any\n  isUserLimitReached?: boolean\n}) {'
);

content = content.replace(
  '  subscription,\n  currentUser\n}: {',
  '  subscription,\n  currentUser,\n  isUserLimitReached\n}: {'
);

content = content.replace(
  '<TeamMembersClient users={users} invitations={invitations} roles={roles} />',
  '<TeamMembersClient users={users} invitations={invitations} roles={roles} isLimitReached={isUserLimitReached} />'
);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
