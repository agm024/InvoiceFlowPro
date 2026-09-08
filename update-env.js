const fs = require('fs');

let env = fs.readFileSync('.env', 'utf8');

// Comment out existing keys
env = env.replace(/RAZORPAY_KEY_ID="rzp_live/g, '# (Live) RAZORPAY_KEY_ID="rzp_live');
env = env.replace(/RAZORPAY_KEY_SECRET="y0vF3/g, '# (Live) RAZORPAY_KEY_SECRET="y0vF3');
env = env.replace(/NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live/g, '# (Live) NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live');

// Append test keys
const testKeys = `
# Razorpay Test Keys
RAZORPAY_KEY_ID="rzp_test_TZXqTeAGCJbq4b"
RAZORPAY_KEY_SECRET="OWYe66cbMt6OWKFEsAsJxug9"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_TZXqTeAGCJbq4b"
`;

env += testKeys;

fs.writeFileSync('.env', env, 'utf8');
console.log('Updated .env with test keys.');
