import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: {
      passwordHash: null
    }
  })

  if (users.length === 0) {
    console.log('No users need password updates.')
    return
  }

  const defaultPasswordHash = await bcrypt.hash('password123', 10)

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: defaultPasswordHash }
    })
    console.log(`Updated password for ${user.email}`)
  }

  console.log(`\n✅ Successfully set default password "password123" for ${users.length} existing users.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
