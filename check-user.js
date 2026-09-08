const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'razorpay-review@invoiceflowpro.com' }, include: { company: true } });
  console.log(user);
}

main().finally(() => prisma.$disconnect());
