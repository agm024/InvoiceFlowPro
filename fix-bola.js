const fs = require('fs');

// Fix 1: app/app/projects/new/page.tsx
let p1 = fs.readFileSync('app/app/projects/new/page.tsx', 'utf8');
p1 = p1.replace(/const clients = await prisma\.client\.findMany\(\{[\s\S]*?orderBy: \{ name: 'asc' \}[\s\S]*?\}\)/, `const clients = await prisma.client.findMany({ where: { companyId }, orderBy: { name: 'asc' } })`);
fs.writeFileSync('app/app/projects/new/page.tsx', p1, 'utf8');

// Fix 2: app/app/projects/page.tsx
let p2 = fs.readFileSync('app/app/projects/page.tsx', 'utf8');
p2 = p2.replace(/const projects = await prisma\.project\.findMany\(\{[\s\S]*?include:/, `const projects = await prisma.project.findMany({ where: { companyId }, include:`);
fs.writeFileSync('app/app/projects/page.tsx', p2, 'utf8');

// Fix 3: app/app/invoices/[id]/edit/page.tsx
let p3 = fs.readFileSync('app/app/invoices/[id]/edit/page.tsx', 'utf8');
p3 = p3.replace(/const companySettings = await prisma\.companySettings\.findFirst\(\)/, `const companySettings = await prisma.companySettings.findFirst({ where: { companyId } })`);
fs.writeFileSync('app/app/invoices/[id]/edit/page.tsx', p3, 'utf8');

console.log('Fixed BOLA leaks.');
