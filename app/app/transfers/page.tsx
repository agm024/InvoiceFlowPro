import prisma from '@/utils/prisma'
import TransfersClient from './TransfersClient'
import { requireCompany } from '@/lib/auth-context'

export default async function TransfersPage() {
  const { companyId } = await requireCompany()

  const transfers = await prisma.internalTransfer.findMany({
    where: { companyId },
    orderBy: { date: 'desc' },
    include: {
      fromBank: { select: { id: true, bankName: true, accountNumber: true } },
      toBank: { select: { id: true, bankName: true, accountNumber: true } }
    }
  })

  const banks = await prisma.bank.findMany({
    where: { companyId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, bankName: true, accountNumber: true }
  })

  return <TransfersClient initialTransfers={transfers} banks={banks} />
}
