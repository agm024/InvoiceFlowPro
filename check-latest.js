const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const settings = await prisma.companySettings.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 3,
    include: { company: true }
  });
  console.log(settings.map(s => ({
    name: s.company.name,
    gstin: s.gstin,
    panNo: s.panNo
  })));
}
check().finally(() => prisma.$disconnect());
