const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'razorpay-review@invoiceflowpro.com';
  const password = 'Razorpay@2026';
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists!`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Razorpay Review Team'
    }
  });

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Razorpay Reviewer',
      passwordHash,
      companyId: company.id,
      role: 'ADMIN'
    }
  });

  // Create company settings
  await prisma.companySettings.create({
    data: {
      companyId: company.id,
      companyName: 'Razorpay Review Team',
      email: 'razorpay-review@invoiceflowpro.com'
    }
  });
  
  // Create subscription
  await prisma.subscription.create({
    data: {
      companyId: company.id,
      plan: 'FREE'
    }
  });

  console.log(`Successfully created test credentials for Razorpay.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
