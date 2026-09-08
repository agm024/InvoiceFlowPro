const fs = require('fs');

let page = fs.readFileSync('app/(admin)/app/admin/billing/subscriptions/page.tsx', 'utf8');

page = page.replace(
  /<th className="px-6 py-4">Billing Cycle<\/th>/,
  `<th className="px-6 py-4">Billing Cycle</th>
                <th className="px-6 py-4">Gateway IDs (Razorpay)</th>`
);

page = page.replace(
  /<td className="px-6 py-4 capitalize text-zinc-500">\{sub\.billingInterval\}ly<\/td>/,
  `<td className="px-6 py-4 capitalize text-zinc-500">{sub.billingInterval}ly</td>
                    <td className="px-6 py-4 text-[10px] text-zinc-500 space-y-1">
                      {sub.rzpSubscriptionId && <div><span className="font-semibold text-zinc-400">Sub:</span> {sub.rzpSubscriptionId}</div>}
                      {sub.company.rzpCustomerId && <div><span className="font-semibold text-zinc-400">Cust:</span> {sub.company.rzpCustomerId}</div>}
                      {(sub.billingInterval === 'year' ? sub.plan.rzpPlanIdYearly : sub.plan.rzpPlanIdMonthly) && <div><span className="font-semibold text-zinc-400">Plan:</span> {sub.billingInterval === 'year' ? sub.plan.rzpPlanIdYearly : sub.plan.rzpPlanIdMonthly}</div>}
                    </td>`
);

fs.writeFileSync('app/(admin)/app/admin/billing/subscriptions/page.tsx', page, 'utf8');
