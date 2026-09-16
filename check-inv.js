const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const invoices = await prisma.invoice.findMany({
    where: { invoiceNumber: 'INV-002', isDeleted: false },
    include: { company: true }
  });
  invoices.forEach(i => console.log(i.id, i.company.name, i.createdAt));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
