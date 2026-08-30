import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.platformPayment.deleteMany({
    where: {
      gatewayTransactionId: { in: ["pay_xyz123", "ch_xyz123"] }
    }
  })
  console.log('Dummy data cleared')
}

main().finally(() => prisma.$disconnect())
