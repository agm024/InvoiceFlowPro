"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { redirect } from "next/navigation"

export async function savePlan(formData: FormData) {
  const admin = await requireSuperAdmin()
  
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const monthlyPrice = parseFloat(formData.get("monthlyPrice") as string)
  const yearlyPrice = parseFloat(formData.get("yearlyPrice") as string)
  const currency = formData.get("currency") as string
  const isPopular = formData.get("isPopular") === "on"
  const trialPeriod = parseInt(formData.get("trialPeriod") as string)
  const displayOrder = parseInt(formData.get("displayOrder") as string)
  
  // Validate annual price discount structure
  if (yearlyPrice > monthlyPrice * 12) {
    throw new Error("Annual price cannot exceed 12x the monthly price.")
  }

  // Parse limits to nullable Int? (null represents Unlimited)
  const userLimitsRaw = formData.get("userLimits") as string
  const clientLimitsRaw = formData.get("clientLimits") as string
  const invoiceLimitsRaw = formData.get("invoiceLimits") as string

  const userLimits = userLimitsRaw === "" ? null : parseInt(userLimitsRaw)
  const clientLimits = clientLimitsRaw === "" ? null : parseInt(clientLimitsRaw)
  const invoiceLimits = invoiceLimitsRaw === "" ? null : parseInt(invoiceLimitsRaw)

  const data = {
    name,
    monthlyPrice,
    yearlyPrice,
    currency,
    isPopular,
    trialPeriod,
    displayOrder,
    userLimits,
    clientLimits,
    invoiceLimits
  }

  if (id) {
    await prisma.plan.update({ where: { id }, data })
    await logAudit({ action: 'PLAN_UPDATED', targetId: id, metadata: data })
  } else {
    const newPlan = await prisma.plan.create({ data })
    await logAudit({ action: 'PLAN_CREATED', targetId: newPlan.id, metadata: data })
  }

  redirect("/app/admin/billing/plans")
}
