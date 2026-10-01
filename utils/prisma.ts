import { PrismaClient } from '@prisma/client'


const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`
  
  // Use Neon serverless adapter only for remote Neon databases
  if (connectionString.includes('neon.tech')) {
    const { Pool, neonConfig } = require('@neondatabase/serverless')
    const { PrismaNeon } = require('@prisma/adapter-neon')
    const ws = require('ws')
    
    neonConfig.webSocketConstructor = ws
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)
    return new PrismaClient({ adapter } as any)
  }

  // Fallback to standard native TCP Prisma connection for local development
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

