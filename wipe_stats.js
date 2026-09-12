const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Wiping logs...");
  await prisma.auditLog.deleteMany({});
  await prisma.emailLog.deleteMany({});
  await prisma.webhookLog.deleteMany({});
  await prisma.backgroundJobLog.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.platformPayment.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.companySettings.deleteMany({});

  const superAdmin = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
  
  if (superAdmin) {
    console.log("Keeping super admin:", superAdmin.email);
    await prisma.user.deleteMany({ where: { id: { not: superAdmin.id } } });
    await prisma.company.deleteMany({ where: { id: { not: superAdmin.companyId } } });
  } else {
    const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (firstUser) {
      console.log("Keeping first user:", firstUser.email);
      await prisma.user.deleteMany({ where: { id: { not: firstUser.id } } });
      await prisma.company.deleteMany({ where: { id: { not: firstUser.companyId } } });
    }
  }

  console.log("Wipe complete!");
}

main().finally(() => prisma.$disconnect());
