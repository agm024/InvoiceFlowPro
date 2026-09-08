const fs = require('fs');
let config = fs.readFileSync('next.config.ts', 'utf8');

config = config.replace(
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://o4512011724587008.ingest.us.sentry.io https://va.vercel-scripts.com;",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://o4512011724587008.ingest.us.sentry.io https://va.vercel-scripts.com https://checkout.razorpay.com;"
);

// Frame source might also be needed for razorpay modals
if (config.includes("frame-src 'self'")) {
  config = config.replace(
    /frame-src 'self'[^;]*;/,
    "$&".replace(";", " https://api.razorpay.com;")
  );
} else {
  // Add frame-src if not exists
  config = config.replace(
    /script-src[^;]*;/,
    "$& frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;"
  );
}

fs.writeFileSync('next.config.ts', config, 'utf8');
console.log('Updated CSP');
