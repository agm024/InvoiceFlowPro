import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const payments = await prisma.platformPayment.findMany()
  console.log("Current payments:", payments)
}
main().finally(() => prisma.$disconnect())
