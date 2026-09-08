const fs = require('fs');
let layout = fs.readFileSync('components/AppLayoutClient.tsx', 'utf8');

if (!layout.includes('<GlobalSearch />')) {
  layout = layout.replace(
    '    </div>\n  )\n}',
    '      <GlobalSearch />\n      <GlobalCreateMenu />\n    </div>\n  )\n}'
  );
  fs.writeFileSync('components/AppLayoutClient.tsx', layout, 'utf8');
}
