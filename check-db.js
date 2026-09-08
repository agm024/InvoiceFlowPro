const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const subs = await prisma.subscription.findMany({
    include: { company: true, plan: true }
  });
  console.log(JSON.stringify(subs, null, 2));
}

check().finally(() => prisma.$disconnect());
