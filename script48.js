const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

content = content.replace(
  '  subscription?: any\n  isUserLimitReached?: boolean',
  '  subscription?: any,\n  isUserLimitReached?: boolean'
);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
