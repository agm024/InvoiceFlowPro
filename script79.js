const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

// The replacement failed, so let's do it with regex
content = content.replace(
  /<nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full">/,
  `<div className="relative">\n          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full mask-gradient">`
);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
