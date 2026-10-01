import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    return new PrismaClient()
  }

  // Next.js App Router static build phase has a known bug where the URL 
  // global polyfill causes pg-connection-string to drop the host and user,
  // crashing the @neondatabase/serverless Pool constructor.
  // 
  // Since Vercel Serverless Functions (Node.js) fully support standard TCP
  // connections, we can safely use the native Prisma Rust engine.
  // Neon's connection pooling is still utilized as long as the connection 
  // string has ?pgbouncer=true (which Neon provides by default).
  
  return new PrismaClient({
    datasourceUrl: connectionString
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
