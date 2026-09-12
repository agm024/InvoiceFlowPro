const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.company.updateMany({ data: { isTestAccount: false } }).then(console.log).finally(() => p.$disconnect());
