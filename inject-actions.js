const fs = require('fs');

let page = fs.readFileSync('app/(admin)/app/admin/billing/subscriptions/page.tsx', 'utf8');

if (!page.includes('SubscriptionActions')) {
  page = page.replace(
    /import Link from "next\/link"/,
    `import Link from "next/link"\nimport { SubscriptionActions } from "./SubscriptionActions"`
  );

  page = page.replace(
    /<th className="px-6 py-4">Created Date<\/th>/,
    `<th className="px-6 py-4">Created Date</th>\n                <th className="px-6 py-4 text-right">Actions</th>`
  );

  page = page.replace(
    /<td className="px-6 py-4 text-zinc-400">\s*\{format\(new Date\(sub\.createdAt\), 'dd MMM yyyy'\)\}\s*<\/td>/,
    `<td className="px-6 py-4 text-zinc-400">
                      {format(new Date(sub.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SubscriptionActions subId={sub.id} status={sub.status} />
                    </td>`
  );
  
  page = page.replace(
    /colSpan=\{6\}/,
    'colSpan={7}'
  );

  fs.writeFileSync('app/(admin)/app/admin/billing/subscriptions/page.tsx', page, 'utf8');
}
