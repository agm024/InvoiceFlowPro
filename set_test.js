const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.company.updateMany({ data: { isTestAccount: true } }).then(console.log).finally(() => p.$disconnect());
