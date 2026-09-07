const fs = require('fs');
let file = 'next.config.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /script-src 'self' 'unsafe-eval' 'unsafe-inline' https:\/\/o4512011724587008\.ingest\.us\.sentry\.io;/,
    `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://o4512011724587008.ingest.us.sentry.io https://va.vercel-scripts.com;\n    worker-src 'self' blob:;`
);

fs.writeFileSync(file, content, 'utf8');
