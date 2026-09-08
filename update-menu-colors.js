const fs = require('fs');

let menu = fs.readFileSync('components/GlobalCreateMenu.tsx', 'utf8');

menu = menu.replace(/bg-blue-600/g, 'bg-primary');
menu = menu.replace(/hover:bg-blue-700/g, 'hover:bg-primary-hover');
menu = menu.replace(/shadow-blue-600\/20/g, 'shadow-primary/20');

fs.writeFileSync('components/GlobalCreateMenu.tsx', menu, 'utf8');

