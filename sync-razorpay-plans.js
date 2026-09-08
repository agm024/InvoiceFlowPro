const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');
require('dotenv').config();

const prisma = new PrismaClient();
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function sync() {
  const plans = await prisma.plan.findMany();
  for (const plan of plans) {
    if (plan.name === 'Free') continue; // Free plan doesn't need razorpay subscription

    console.log(`Syncing ${plan.name}...`);
    
    // Monthly
    if (!plan.rzpPlanIdMonthly && plan.monthlyPrice > 0) {
      const rzpPlanM = await rzp.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `${plan.name} Monthly`,
          amount: Math.round(plan.monthlyPrice * 100),
          currency: plan.currency,
          description: `Monthly subscription for ${plan.name}`
        }
      });
      await prisma.plan.update({ where: { id: plan.id }, data: { rzpPlanIdMonthly: rzpPlanM.id } });
      console.log(`Created Monthly: ${rzpPlanM.id}`);
    }

    // Yearly
    if (!plan.rzpPlanIdYearly && plan.yearlyPrice > 0) {
      const rzpPlanY = await rzp.plans.create({
        period: 'yearly',
        interval: 1,
        item: {
          name: `${plan.name} Yearly`,
          amount: Math.round(plan.yearlyPrice * 100),
          currency: plan.currency,
          description: `Yearly subscription for ${plan.name}`
        }
      });
      await prisma.plan.update({ where: { id: plan.id }, data: { rzpPlanIdYearly: rzpPlanY.id } });
      console.log(`Created Yearly: ${rzpPlanY.id}`);
    }
  }
  console.log('Sync complete!');
}

sync().catch(console.error).finally(() => prisma.$disconnect());
