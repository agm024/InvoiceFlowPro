const fs = require('fs');
let file = fs.readFileSync('lib/auth-context.ts', 'utf8');

if (!file.includes("company?.status === 'SUSPENDED'")) {
  file = file.replace(
    /if \(\!user\.companyId\) \{\s*redirect\('\/onboarding'\)\s*\}/,
    `if (!user.companyId) {
    redirect('/onboarding')
  }

  const company = await prisma.company.findUnique({ where: { id: user.companyId } });
  if (company?.status === 'SUSPENDED') {
    redirect('/suspended');
  }`
  );
  fs.writeFileSync('lib/auth-context.ts', file, 'utf8');
}
