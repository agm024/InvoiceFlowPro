import { PrismaClient } from '@prisma/client'
import { slugify } from '../utils/slugify'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting backfill for slugs...')

  // Backfill Clients
  const clients = await prisma.client.findMany()
  for (const client of clients) {
    if (!client.slug || client.slug.length === 25) { // default cuid length is 25
      const baseSlug = slugify(client.name) || 'client'
      let slug = baseSlug
      let count = 1
      while (true) {
        const existing = await prisma.client.findUnique({ where: { slug } })
        if (!existing || existing.id === client.id) break
        slug = `${baseSlug}-${count}`
        count++
      }
      await prisma.client.update({
        where: { id: client.id },
        data: { slug }
      })
      console.log(`Updated client ${client.name} with slug: ${slug}`)
    }
  }

  // Backfill Products
  const products = await prisma.product.findMany()
  for (const product of products) {
    if (!product.slug || product.slug.length === 25) {
      const baseSlug = slugify(product.name) || 'product'
      let slug = baseSlug
      let count = 1
      while (true) {
        const existing = await prisma.product.findUnique({ where: { slug } })
        if (!existing || existing.id === product.id) break
        slug = `${baseSlug}-${count}`
        count++
      }
      await prisma.product.update({
        where: { id: product.id },
        data: { slug }
      })
      console.log(`Updated product ${product.name} with slug: ${slug}`)
    }
  }

  console.log('Slug backfill complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
