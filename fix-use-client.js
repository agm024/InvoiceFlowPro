const fs = require('fs');

let client = fs.readFileSync('app/app/billing/BillingClient.tsx', 'utf8');

// Remove all "use client" occurrences
client = client.replace(/"use client"\n?/g, '');
client = client.replace(/'use client'\n?/g, '');

// Prepend "use client"
client = `"use client"\n` + client.trimStart();

fs.writeFileSync('app/app/billing/BillingClient.tsx', client, 'utf8');
