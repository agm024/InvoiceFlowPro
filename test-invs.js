const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const invs = await prisma.invoice.findMany({ include: { milestone: true } });
  console.log(invs.map(i => ({ id: i.id, num: i.invoiceNumber, hasMilestone: !!i.milestone, clientId: i.clientId })));
}
run().finally(() => prisma.$disconnect());
