import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const company = await prisma.company.findFirst()
  if (!company) {
    console.log('No company found to seed payments')
    return
  }
  
  let sub = await prisma.subscription.findFirst({ where: { companyId: company.id }})
  
  if (!sub) {
    const plan = await prisma.plan.findFirst()
    if (!plan) return;
    
    sub = await prisma.subscription.create({
      data: {
        companyId: company.id,
        planId: plan.id,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
  }

  // Check if payments exist
  const count = await prisma.platformPayment.count()
  if (count === 0) {
    console.log('Seeding fake platform payments...')
    await prisma.platformPayment.createMany({
      data: [
        {
          companyId: company.id,
          subscriptionId: sub.id,
          originalAmount: 2900,
          originalCurrency: "INR",
          convertedAmountInr: 2900,
          exchangeRate: 1.0,
          gatewayTransactionId: "pay_xyz123",
          status: "SUCCESS"
        },
        {
          companyId: company.id,
          subscriptionId: sub.id,
          originalAmount: 49,
          originalCurrency: "USD",
          convertedAmountInr: 49 * 83.5,
          exchangeRate: 83.5,
          gatewayTransactionId: "ch_xyz123",
          status: "SUCCESS"
        }
      ]
    })
    console.log('Done seeding')
  } else {
    console.log('Payments already exist')
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
