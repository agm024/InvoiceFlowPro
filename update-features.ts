import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.plan.updateMany({
    where: { name: 'Free' },
    data: {
      features: ['Basic Reporting']
    }
  })
  
  await prisma.plan.updateMany({
    where: { name: 'Pro Tier' },
    data: {
      features: ['Advanced Reporting', 'Dedicated Client Portal']
    }
  })
  
  await prisma.plan.updateMany({
    where: { name: 'Max' },
    data: {
      features: ['Advanced Reporting', 'Dedicated Client Portal', 'Priority Support', 'White-labeling']
    }
  })
  
  console.log('Features updated')
}

main().catch(e => console.error(e))
