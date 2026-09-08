const fs = require('fs');
let config = fs.readFileSync('next.config.ts', 'utf8').replace(/\r\n/g, '\n');

config = config.replace(
  "https://va.vercel-scripts.com https://checkout.razorpay.com",
  "https://va.vercel-scripts.com https://checkout.razorpay.com https://cdn.razorpay.com"
);

fs.writeFileSync('next.config.ts', config, 'utf8');
