const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const plans = await prisma.plan.findMany();
  console.log(plans.map(p => p.name));
}
run().finally(() => prisma.$disconnect());
