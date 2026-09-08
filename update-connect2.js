const fs = require('fs');

let config = fs.readFileSync('next.config.ts', 'utf8').replace(/\r\n/g, '\n');

config = config.replace(
  "connect-src 'self' https://o4512011724587008.ingest.us.sentry.io https://accounts.google.com https://vitals.vercel-insights.com;",
  "connect-src 'self' https://o4512011724587008.ingest.us.sentry.io https://accounts.google.com https://vitals.vercel-insights.com https://api.razorpay.com https://checkout.razorpay.com https://lumberjack.razorpay.com;"
);

// wait, the error mentions script-src 'self' 'unsafe-eval' 'unsafe-inline' https://o4512011724587008.ingest.us.sentry.io https://va.vercel-scripts.com;
// But the current file has https://checkout.razorpay.com appended.
// Is it possible the browser is caching the headers heavily? Yes.

fs.writeFileSync('next.config.ts', config, 'utf8');
