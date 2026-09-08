const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const settings = await prisma.companySettings.findFirst({
    where: { company: { name: 'Razorpay Review Team' } }
  });
  console.log('GSTIN:', settings?.gstin, 'PAN:', settings?.panNo);
}
check().finally(() => prisma.$disconnect());
