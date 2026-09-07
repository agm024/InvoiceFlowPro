const fs = require('fs');
let file = 'next.config.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /connect-src 'self' https:\/\/o4512011724587008\.ingest\.us\.sentry\.io https:\/\/accounts\.google\.com;/,
    `connect-src 'self' https://o4512011724587008.ingest.us.sentry.io https://accounts.google.com https://vitals.vercel-insights.com;`
);

fs.writeFileSync(file, content, 'utf8');
