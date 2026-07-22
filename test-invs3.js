const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const invs = await prisma.invoice.findMany({ include: { milestone: true, client: true } });
  console.log(invs.filter(i => !i.milestone).map(i => ({ num: i.invoiceNumber, client: i.client.slug, status: i.status })));
}
run().finally(() => prisma.$disconnect());
