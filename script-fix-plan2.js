const fs = require('fs');

function fixPlan(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /prisma\.subscription\.findUnique\(\{ where: \{ companyId: invoice\.companyId \} \}\)/g,
    `prisma.subscription.findUnique({ where: { companyId: invoice.companyId }, include: { plan: true } })`
  );
  content = content.replace(
    /subscription\.plan === 'FREE'/g,
    `subscription.plan.name === 'FREE'`
  );
  fs.writeFileSync(file, content, 'utf8');
}

fixPlan('app/app/invoices/[id]/page.tsx');
fixPlan('app/pay/[id]/invoice/page.tsx');
