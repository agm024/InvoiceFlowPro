const fs = require('fs');

const logic = `
    const freePlan = await tx.plan.findFirst({ where: { name: 'Free' } });
    if (freePlan) {
      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: freePlan.id,
          status: 'active',
          billingInterval: 'month'
        }
      });
    }
`;

let onboard = fs.readFileSync('app/onboarding/actions.ts', 'utf8');
if (!onboard.includes('await tx.subscription.create')) {
    onboard = onboard.replace(
        /await tx\.user\.create\(\{[\s\S]*?\}\)/,
        match => match + '\n' + logic
    );
    fs.writeFileSync('app/onboarding/actions.ts', onboard, 'utf8');
}
