const fs = require('fs');

// Fix 1: app/app/invoices/[id]/edit/page.tsx
let e1 = fs.readFileSync('app/app/invoices/[id]/edit/page.tsx', 'utf8');
e1 = e1.replace(/const \{ companyId \} = await requireCompany\(\)\n  const clients/, 'const clients');
e1 = e1.replace(/const \{ id \} = await params\n/, 'const { id } = await params\n  const { companyId } = await requireCompany()\n');
fs.writeFileSync('app/app/invoices/[id]/edit/page.tsx', e1, 'utf8');

// Fix 2: app/app/projects/new/page.tsx
let p1 = fs.readFileSync('app/app/projects/new/page.tsx', 'utf8');
p1 = p1.replace(/export default async function NewProjectPage\(\)\s*\{[\s\S]*?const \{ companyId \} = await requireCompany\(\);/, 'export default async function NewProjectPage() {\n  const { companyId } = await requireCompany();');
fs.writeFileSync('app/app/projects/new/page.tsx', p1, 'utf8');

// Fix 3: app/pricing/PricingClient.tsx missing router/toast import
let pc = fs.readFileSync('app/pricing/PricingClient.tsx', 'utf8');
pc = pc.replace("import { useState } from 'react'", "import { useState } from 'react'\nimport { useRouter } from 'next/navigation'\nimport toast from 'react-hot-toast'");
fs.writeFileSync('app/pricing/PricingClient.tsx', pc, 'utf8');

console.log('Fixed syntax errors.');
