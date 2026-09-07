const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

// 1. Fix classes
const searchClass = `? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-800/20 text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' \r\n                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-sidebar-bg hover:text-foreground'`;
const replaceClass = `? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' \n                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-sidebar-bg hover:text-foreground'`;
content = content.replace(searchClass, replaceClass);

content = content.replace(
  `className={isActive ? 'text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' : 'text-zinc-400'}`,
  `className={isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`
);

// 2. Fix the scroll layout
const searchNav = `<nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full">`;
const replaceNav = `<div className="relative">\n          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full mask-gradient">`;
content = content.replace(searchNav, replaceNav);

const searchNavEnd = `        </nav>\r\n      </div>`;
const replaceNavEnd = `        </nav>\n          <div className="md:hidden absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />\n        </div>\n      </div>`;
content = content.replace(searchNavEnd, replaceNavEnd);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
