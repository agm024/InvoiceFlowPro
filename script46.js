const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

content = content.replace(
  '  subscription = null\n}: {',
  '  subscription = null,\n  isUserLimitReached\n}: {'
);
content = content.replace(
  '  subscription?: any\n}) {',
  '  subscription?: any\n  isUserLimitReached?: boolean\n}) {'
);
content = content.replace(
  '<TeamMembersClient users={users} invitations={invitations} roles={roles} isLimitReached={isUserLimitReached} />',
  '<TeamMembersClient users={users} invitations={invitations} roles={roles} isLimitReached={isUserLimitReached} />'
);

// If it wasn't replaced before:
if (!content.includes('isLimitReached={isUserLimitReached}')) {
  content = content.replace(
    '<TeamMembersClient users={users} invitations={invitations} roles={roles} />',
    '<TeamMembersClient users={users} invitations={invitations} roles={roles} isLimitReached={isUserLimitReached} />'
  );
}

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
