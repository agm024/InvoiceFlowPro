const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOrder() {
  const projects = await prisma.project.findMany({
    include: {
      milestones: {
        orderBy: { id: 'asc' } // cuid is time-sortable
      }
    }
  });

  for (const project of projects) {
    for (let i = 0; i < project.milestones.length; i++) {
      await prisma.milestone.update({
        where: { id: project.milestones[i].id },
        data: { orderIndex: i }
      });
    }
  }
  
  console.log('Fixed milestone order indexes.');
}

fixOrder()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
