'use server'

import { requireSuperAdmin } from '@/lib/auth-context'
import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'
import { logAudit } from "@/lib/audit"

export async function updateTicketDetails(id: string, status: string, priority: string, reason: string) {
  await requireSuperAdmin()
  const ticket = await prisma.ticket.findUnique({ where: { id } })
  if (!ticket) throw new Error("Ticket not found")

  await prisma.ticket.update({
    where: { id },
    data: { status, priority }
  })

  await logAudit({
    action: "TICKET_UPDATED",
    companyId: ticket.companyId,
    targetId: id,
    reason,
    before: { status: ticket.status, priority: ticket.priority },
    after: { status, priority }
  })

  revalidatePath('/app/admin/support/tickets')
}
