const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const companies = await prisma.company.findMany({
    include: { settings: true }
  });
  console.log(companies.map(c => ({
    name: c.name,
    c_gstin: c.gstin,
    c_pan: c.pan,
    s_gstin: c.settings?.gstin,
    s_pan: c.settings?.panNo
  })));
}
check().finally(() => prisma.$disconnect());
