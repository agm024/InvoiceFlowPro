const fs = require('fs');

let layout = fs.readFileSync('components/AppLayoutClient.tsx', 'utf8');

if (!layout.includes('import GlobalSearch')) {
    layout = layout.replace(
      "import GlobalCreateMenu from './GlobalCreateMenu'",
      "import GlobalCreateMenu from './GlobalCreateMenu'\nimport GlobalSearch from './GlobalSearch'"
    );

    layout = layout.replace(
      '<GlobalCreateMenu />',
      '<GlobalSearch />\n      <GlobalCreateMenu />'
    );

    fs.writeFileSync('components/AppLayoutClient.tsx', layout, 'utf8');
}
