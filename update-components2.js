const fs = require('fs');
let layout = fs.readFileSync('components/AppLayoutClient.tsx', 'utf8');

layout = layout.replace(/<\/main>\s*<\/div>\s*\)\s*\}\s*$/, "</main>\n      <GlobalSearch />\n      <GlobalCreateMenu />\n    </div>\n  )\n}");
fs.writeFileSync('components/AppLayoutClient.tsx', layout, 'utf8');

