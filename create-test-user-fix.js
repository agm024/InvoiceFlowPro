const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'razorpay-review@invoiceflowpro.com';
  
  const company = await prisma.company.findFirst({ where: { name: 'Razorpay Review Team' } });
  
  if (company) {
    await prisma.subscription.create({
      data: {
        plan: 'FREE',
        company: { connect: { id: company.id } }
      }
    });
    console.log(`Successfully created test credentials for Razorpay.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
