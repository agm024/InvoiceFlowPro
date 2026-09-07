const fs = require('fs');
let file1 = 'app/app/invoices/[id]/page.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(
  /prisma\.subscription\.findUnique\(\{ where: \{ companyId: invoice\.companyId \} \}\)/g,
  `prisma.subscription.findUnique({ where: { companyId: invoice.companyId }, include: { plan: true } })`
);
// wait, the if statement is `subscription.plan === 'FREE'` which works if plan is a string or an object with name 'FREE'
// Let's check what plan is.
// Actually, earlier I saw `company?.subscription?.plan?.invoiceLimits` so plan is an object, but what if I just check `subscription.plan.name === 'FREE'`?
// No, earlier the limit check was: `company.subscription.plan.invoiceLimits`.
// Wait, `subscription.plan.name === 'FREE'`? Let's look at `plan` model.
