const fs = require('fs');

let route = fs.readFileSync('app/api/razorpay/webhook/route.ts', 'utf8');

// Add handling for paused and resumed
const additionalHandlers = `
    if (event.event === 'subscription.paused') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        await prisma.subscription.update({
          where: { companyId },
          data: { status: 'paused' }
        });
      }
    }

    if (event.event === 'subscription.resumed') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;
      if (companyId) {
        await prisma.subscription.update({
          where: { companyId },
          data: { status: 'active' }
        });
      }
    }
`;

route = route.replace(
  /if \(event\.event === 'subscription\.cancelled'/,
  `${additionalHandlers}\n    if (event.event === 'subscription.cancelled'`
);

fs.writeFileSync('app/api/razorpay/webhook/route.ts', route, 'utf8');
