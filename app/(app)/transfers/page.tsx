import prisma from '@/utils/prisma'
import TransfersClient from './TransfersClient'

export default async function TransfersPage() {
  const transfers = await prisma.internalTransfer.findMany({
    orderBy: { date: 'desc' },
    include: {
      fromBank: { select: { id: true, bankName: true, accountNumber: true } },
      toBank: { select: { id: true, bankName: true, accountNumber: true } }
    }
  })

  const banks = await prisma.bank.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, bankName: true, accountNumber: true }
  })

  // We convert the dates to string or just pass the objects. Next.js handles Date objects in Server Components to Client Components in Next 14+ if passed directly to client component props? Wait, actually Prisma returns native JS Date objects, we might need to serialize them or just rely on Next.js 14+ auto serialization.
  // Next 14+ app router supports passing Dates natively to Client Components!
  
  return <TransfersClient initialTransfers={transfers} banks={banks} />
}
