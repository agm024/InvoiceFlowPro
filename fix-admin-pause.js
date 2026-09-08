const fs = require('fs');
let route = fs.readFileSync('app/api/admin/subscriptions/action/route.ts', 'utf8');

route = route.replace(
  /await prisma\.subscription\.update\(\{\s*where: \{ id \},\s*data: \{ status: 'paused' \}\s*\}\);/,
  `const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
      await prisma.subscription.update({
        where: { id },
        data: { status: 'paused', planId: freePlan?.id || sub.planId }
      });`
);

fs.writeFileSync('app/api/admin/subscriptions/action/route.ts', route, 'utf8');
