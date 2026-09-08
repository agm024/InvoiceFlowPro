const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { company: true } });
  console.log(users.map(u => ({ email: u.email, companyId: u.companyId, companyName: u.company?.name })));
}

main().finally(() => prisma.$disconnect());
