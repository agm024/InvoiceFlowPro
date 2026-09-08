const fs = require('fs');
let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

if (!client.includes('import { useRouter }')) {
  client = `import { useRouter } from 'next/navigation'\n` + client;
}
if (!client.includes('import Script')) {
  client = `import Script from 'next/script'\n` + client;
}
if (!client.includes('import toast')) {
  client = `import toast from 'react-hot-toast'\n` + client;
}

fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');
console.log('Fixed imports.');
