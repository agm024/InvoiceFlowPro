import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.platformPayment.count().then(c => console.log("COUNT IS: ", c))
