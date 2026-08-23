'use server'

import { requireCompany } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleSupportAccess(granted: boolean) {
  const { companyId } = await requireCompany()

  await prisma.company.update({
    where: { id: companyId },
    data: { supportAccessGranted: granted }
  })

  revalidatePath('/app/settings')
}
