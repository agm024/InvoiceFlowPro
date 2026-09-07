const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

const search = `? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-zinc-800/20 text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-sidebar-bg hover:text-foreground'`;
const replace = `? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-sidebar-bg hover:text-foreground'`;

content = content.replace(search, replace);

const searchIcon = `className={isActive ? 'text-zinc-900 dark:text-white dark:text-zinc-900 dark:text-white' : 'text-zinc-400'}`;
const replaceIcon = `className={isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`;
content = content.replace(searchIcon, replaceIcon);

fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
