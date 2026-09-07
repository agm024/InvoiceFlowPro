const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

// Fix Classes
content = content.replace(
  /\? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-800\/20 text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white'/g,
  `? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'`
);
content = content.replace(
  /className=\{isActive \? 'text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' : 'text-zinc-400'\}/g,
  `className={isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`
);

// Fix layout
content = content.replace(
  /<nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 md:pb-0">/,
  `<div className="relative">\n        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar pb-2 md:pb-0">`
);

content = content.replace(
  /        <\/nav>\r?\n      <\/div>/,
  `        </nav>\n        <div className="md:hidden absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />\n      </div>\n      </div>`
);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
