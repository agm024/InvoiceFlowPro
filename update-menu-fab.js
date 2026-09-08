const fs = require('fs');

let menu = fs.readFileSync('components/GlobalCreateMenu.tsx', 'utf8');

menu = menu.replace(
  'className="fixed bottom-6 right-6 md:top-6 md:bottom-auto z-50 print:hidden"',
  'className="fixed bottom-8 right-8 z-50 print:hidden"'
);

menu = menu.replace(
  'md:bottom-auto md:top-full md:mt-2 w-56',
  'md:mb-2 w-56'
);

// We should also remove md:slide-in-from-top-2 so it always slides from bottom
menu = menu.replace(
  'slide-in-from-bottom-2 md:slide-in-from-top-2',
  'slide-in-from-bottom-2'
);

fs.writeFileSync('components/GlobalCreateMenu.tsx', menu, 'utf8');

