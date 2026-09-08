const fs = require('fs');
let config = fs.readFileSync('next.config.ts', 'utf8');

config = config.replace(
  /connect-src 'self'[^;]*;/,
  "$&".replace(";", " https://api.razorpay.com https://lumberjack.razorpay.com https://checkout.razorpay.com;")
);

fs.writeFileSync('next.config.ts', config, 'utf8');
