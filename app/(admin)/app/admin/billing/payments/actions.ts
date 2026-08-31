"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export async function refundPayment(paymentId: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  const payment = await prisma.platformPayment.findUnique({
    where: { id: paymentId }
  })

  if (!payment) throw new Error("Payment record not found")
  if (payment.status === "REFUNDED") throw new Error("Payment is already refunded")

  const updatedPayment = await prisma.platformPayment.update({
    where: { id: paymentId },
    data: { status: "REFUNDED" }
  })

  await logAudit({
    action: "PAYMENT_REFUNDED",
    targetId: paymentId,
    companyId: payment.companyId,
    reason: "Refund issued by platform administrator",
    before: { status: payment.status },
    after: { status: "REFUNDED" },
    metadata: { amount: payment.originalAmount, currency: payment.originalCurrency }
  })

  revalidatePath("/app/admin/billing/payments")
  revalidatePath("/app/admin/billing/revenue")
  revalidatePath("/app/admin")
}
