const fs = require('fs');

// Fix 1: app/app/invoices/[id]/edit/page.tsx
let e1 = fs.readFileSync('app/app/invoices/[id]/edit/page.tsx', 'utf8');
e1 = e1.replace("const companySettings = await prisma.companySettings.findFirst({ where: { companyId } })", "const companySettings = await prisma.companySettings.findFirst({ where: { companyId: invoice.companyId } })");
fs.writeFileSync('app/app/invoices/[id]/edit/page.tsx', e1, 'utf8');

// Fix 2: app/app/projects/new/page.tsx
let p1 = fs.readFileSync('app/app/projects/new/page.tsx', 'utf8');
if (!p1.includes("const { companyId } = await requireCompany()")) {
  p1 = p1.replace("export default async function NewProjectPage() {", "export default async function NewProjectPage() {\n  const { companyId } = await requireCompany();");
}
fs.writeFileSync('app/app/projects/new/page.tsx', p1, 'utf8');

console.log('Fixed auth scoping issues.');
