const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const company = await prisma.company.findFirst({
    where: { name: 'Razorpay Review Team' }
  });
  console.log(company.gstin, company.pan);
}
check().finally(() => prisma.$disconnect());
