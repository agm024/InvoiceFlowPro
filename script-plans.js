const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const plans = await prisma.plan.findMany();
    console.log(plans);
}
main().finally(() => prisma.$disconnect());
