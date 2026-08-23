import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting multi-tenant migration...')

  // 1. Create Default Company
  const defaultCompany = await prisma.company.create({
    data: {
      name: 'Default Company',
      status: 'ACTIVE',
    },
  })
  console.log('Created Default Company:', defaultCompany.id)

  // 2. Link existing User
  await prisma.user.updateMany({
    data: {
      companyId: defaultCompany.id,
      isSuperAdmin: true, // Make existing user super admin
    },
  })
  console.log('Linked Users to Default Company')

  // 3. Link all models
  const models = [
    'client', 'product', 'bank', 'invoice', 'expense', 
    'project', 'internalTransfer', 'estimate', 'exchangeRate',
    'activityLog', 'asset', 'contract'
  ]

  for (const model of models) {
    try {
      const updated = await (prisma as any)[model].updateMany({
        where: {
          companyId: null
        },
        data: {
          companyId: defaultCompany.id
        }
      })
      console.log(`Linked ${updated.count} records in ${model}`)
    } catch (e) {
      console.log(`Failed to link model ${model}, it might already have companyId required but we are updating it.`)
    }
  }

  // Handle CompanySettings which had id="default"
  try {
    const existingSettings = await prisma.companySettings.findFirst({ where: { id: 'default' } })
    if (existingSettings) {
      await prisma.companySettings.update({
        where: { id: 'default' },
        data: { companyId: defaultCompany.id }
      })
      console.log('Linked CompanySettings')
    }
  } catch (e) {}

  console.log('Migration complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
