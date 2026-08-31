import prisma from '@/utils/prisma'

async function ensureDummy() {
  const count = await prisma.user.count();
  if (count === 0) {
    const company = await prisma.company.create({
      data: {
        name: "Test Company",
        status: "ACTIVE"
      }
    });
    
    await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        companyId: company.id,
        isSuperAdmin: true,
      }
    });
    console.log("Created dummy user and company.");
  } else {
    console.log("Users exist.");
  }
}
ensureDummy().finally(() => prisma.$disconnect());
