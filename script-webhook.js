const fs = require('fs');
let text = fs.readFileSync('app/api/razorpay/webhook/route.ts', 'utf8');

const webhookLogic = `
    if (event.event === 'subscription.charged') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;

      if (companyId) {
        const subscription = await prisma.subscription.findUnique({ where: { companyId } });
        if (subscription) {
          // Extend by 1 month or year based on billingInterval
          const interval = subscription.billingInterval === 'year' ? 365 : 30;
          const currentEnd = subscription.currentPeriodEnd && subscription.currentPeriodEnd > new Date() 
            ? subscription.currentPeriodEnd 
            : new Date();
          const nextEnd = new Date(currentEnd.getTime() + interval * 24 * 60 * 60 * 1000);

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { currentPeriodEnd: nextEnd, status: 'active' }
          });
          
          await prisma.platformPayment.create({
            data: {
              subscriptionId: subscription.id,
              amount: event.payload.payment.entity.amount / 100,
              currency: event.payload.payment.entity.currency,
              status: 'COMPLETED',
              razorpayPaymentId: event.payload.payment.entity.id
            }
          });
        }
      }
    }

    if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      const subEntity = event.payload.subscription.entity;
      const companyId = subEntity.notes?.companyId;

      if (companyId) {
        // Fallback to free plan logic (or mark status as past_due / cancelled)
        const freePlan = await prisma.plan.findFirst({ where: { name: 'Free' } });
        if (freePlan) {
          await prisma.subscription.update({
            where: { companyId },
            data: { planId: freePlan.id, status: event.event === 'subscription.cancelled' ? 'cancelled' : 'past_due' }
          });
        }
      }
    }
`;

text = text.replace(
    /return NextResponse\.json\(\{ status: 'ok' \}\)/,
    webhookLogic + '\n    return NextResponse.json({ status: \'ok\' })'
);

fs.writeFileSync('app/api/razorpay/webhook/route.ts', text, 'utf8');
