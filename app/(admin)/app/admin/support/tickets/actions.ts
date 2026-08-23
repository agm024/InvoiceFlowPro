'use server'

import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export async function updateTicketStatus(formData: FormData) {
  await requireSuperAdmin()
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  if (id && status) {
    await prisma.ticket.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/app/admin/support/tickets')
  }
}
