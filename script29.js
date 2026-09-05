const fs = require('fs');
let content = fs.readFileSync('app/app/settings/actions.ts', 'utf8');

content = content.replace("import { requireCompany } from '@/lib/auth-context'", "import { requireCompany } from '@/lib/auth-context'\nimport { redirect } from 'next/navigation'");

const search = `    const company = await prisma.company.findUnique({ where: { id: companyId } })
    settings = await prisma.companySettings.create({`;

const replacement = `    const company = await prisma.company.findUnique({ where: { id: companyId } })
    if (!company) {
      // If the company was deleted but session/cookie persists, redirect to onboarding or admin
      redirect('/onboarding')
    }
    settings = await prisma.companySettings.create({`;

content = content.replace(search, replacement);
fs.writeFileSync('app/app/settings/actions.ts', content, 'utf8');
