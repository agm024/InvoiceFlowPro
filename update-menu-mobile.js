const fs = require('fs');

let menu = fs.readFileSync('components/GlobalCreateMenu.tsx', 'utf8');

menu = menu.replace(
  'className="fixed top-6 right-6 z-50 hidden md:block print:hidden"',
  'className="fixed bottom-6 right-6 md:top-6 md:bottom-auto z-50 print:hidden"'
);

menu = menu.replace(
  'className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200"',
  'className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 py-2 animate-in fade-in slide-in-from-bottom-2 md:slide-in-from-top-2 duration-200"'
);

fs.writeFileSync('components/GlobalCreateMenu.tsx', menu, 'utf8');

