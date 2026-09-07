const fs = require('fs');
let content = fs.readFileSync('app/app/settings/SettingsTabs.tsx', 'utf8');

const search = `<nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full">`;
const replace = `<div className="relative">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide w-full mask-gradient">`;

content = content.replace(search, replace);

// We need to close the wrapper div! 
const navEndSearch = `        </nav>
      </div>

      {/* Content Area */}`;
const navEndReplace = `        </nav>
          <div className="md:hidden absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content Area */}`;

content = content.replace(navEndSearch, navEndReplace);
fs.writeFileSync('app/app/settings/SettingsTabs.tsx', content, 'utf8');
