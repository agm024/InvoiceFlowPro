const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const milestones = await prisma.milestone.findMany();
  console.log(JSON.stringify(milestones, null, 2));
}

main().finally(() => prisma.$disconnect());
