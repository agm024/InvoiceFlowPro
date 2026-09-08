const fs = require('fs');
let route = fs.readFileSync('app/api/razorpay/webhook/route.ts', 'utf8');

// Replace the paused and resumed handlers with actual plan swapping
route = route.replace(
  /if \(event\.event === 'subscription\.paused'\) \{[\s\S]*?if \(event\.event === 'subscription\.resumed'\) \{[\s\S]*?data: \{ status: 'active' \}\n        \}\);\n      \}\n    \}/,
  `if (event.event === 'subscription.paused') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
        if (freePlan) {
          await prisma.subscription.update({
            where: { companyId },
            data: { status: 'paused', planId: freePlan.id }
          });
        }
      }
    }

    if (event.event === 'subscription.resumed') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        // Find original plan from Razorpay payload
        const rzpPlanId = subEntity.plan_id;
        const originalPlan = await prisma.plan.findFirst({
          where: { OR: [{ rzpPlanIdMonthly: rzpPlanId }, { rzpPlanIdYearly: rzpPlanId }] }
        });
        
        await prisma.subscription.update({
          where: { companyId },
          data: { 
            status: 'active', 
            ...(originalPlan ? { planId: originalPlan.id } : {})
          }
        });
      }
    }`
);

fs.writeFileSync('app/api/razorpay/webhook/route.ts', route, 'utf8');
