const fs = require('fs');
let client = fs.readFileSync('app/(admin)/app/admin/businesses/[id]/BusinessDetailsClient.tsx', 'utf8');

client = client.replace(
  /Status: <span className="font-semibold text-emerald-500 capitalize">\{company\.subscription\?\.status \|\| "active"\}<\/span>/,
  `Status: <span className={\`font-semibold capitalize \${company.subscription?.status === 'active' ? 'text-emerald-500' : company.subscription?.status === 'paused' ? 'text-amber-500' : 'text-red-500'}\`}>{company.subscription?.status || "active"}</span>`
);

fs.writeFileSync('app/(admin)/app/admin/businesses/[id]/BusinessDetailsClient.tsx', client, 'utf8');
