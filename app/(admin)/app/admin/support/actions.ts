"use server"

import { requireSuperAdmin } from "@/lib/auth-context"
import prisma from "@/utils/prisma"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"

export async function resolveTicket(ticketId: string) {
  const admin = await requireSuperAdmin()
  
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "RESOLVED" }
  })
  
  await logAudit({ action: 'TICKET_RESOLVED', targetId: ticketId, metadata: { status: 'RESOLVED' } })
  revalidatePath('/app/admin/support')
}
