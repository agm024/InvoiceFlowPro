const fs = require('fs');

let page = fs.readFileSync('app/(admin)/app/admin/billing/payments/page.tsx', 'utf8');

// Include necessary data
page = page.replace(
  /companyName: p\.company\.name,/,
  `companyName: p.company.name,
    rzpCustomerId: p.company.rzpCustomerId,
    rzpSubscriptionId: p.subscription.rzpSubscriptionId,`
);

fs.writeFileSync('app/(admin)/app/admin/billing/payments/page.tsx', page, 'utf8');

let client = fs.readFileSync('app/(admin)/app/admin/billing/payments/PaymentsTableClient.tsx', 'utf8');

client = client.replace(
  /companyName: string/,
  `companyName: string
  rzpCustomerId: string | null
  rzpSubscriptionId: string | null`
);

client = client.replace(
  /<th className="px-6 py-4">Transaction ID<\/th>/,
  `<th className="px-6 py-4">Gateway IDs (Payment & Sub)</th>`
);

client = client.replace(
  /\{p\.gatewayTransactionId \|\| p\.id\}/,
  `<div><span className="font-semibold text-zinc-400">Pay:</span> {p.gatewayTransactionId || 'N/A'}</div>
                    {p.rzpSubscriptionId && <div className="text-[10px] mt-0.5"><span className="font-semibold text-zinc-400">Sub:</span> {p.rzpSubscriptionId}</div>}
                    {p.rzpCustomerId && <div className="text-[10px] mt-0.5"><span className="font-semibold text-zinc-400">Cust:</span> {p.rzpCustomerId}</div>}`
);

fs.writeFileSync('app/(admin)/app/admin/billing/payments/PaymentsTableClient.tsx', client, 'utf8');
