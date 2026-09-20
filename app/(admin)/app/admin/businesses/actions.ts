"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin, requireWriteAccess } from "@/lib/auth-context"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCompany(formData: FormData) {
  await requireSuperAdmin()
  await requireWriteAccess()

  const name = formData.get("name") as string
  if (!name || name.trim() === "") throw new Error("Company name is required.")

  const company = await prisma.company.create({
    data: {
      name,
      status: "ACTIVE"
    }
  })

  // Associate default pricing plan if one exists
  const freePlan = await prisma.plan.findFirst()
  if (freePlan) {
    await prisma.subscription.create({
      data: {
        companyId: company.id,
        planId: freePlan.id,
        status: "active"
      }
    })
  }

  await logAudit({
    action: "COMPANY_CREATED",
    companyId: company.id,
    reason: "Manual admin onboarding"
  })

  redirect("/app/admin/businesses")
}

export async function suspendCompany(id: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to suspend a company.")
  }

  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) throw new Error("Company not found")

  await prisma.company.update({
    where: { id },
    data: { status: "SUSPENDED" }
  })

  await logAudit({
    action: "COMPANY_SUSPENDED",
    companyId: id,
    reason,
    before: { status: company.status },
    after: { status: "SUSPENDED" }
  })

  revalidatePath(`/app/admin/businesses/${id}`)
}

export async function reactivateCompany(id: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to reactivate a company.")
  }

  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) throw new Error("Company not found")

  await prisma.company.update({
    where: { id },
    data: { status: "ACTIVE" }
  })

  await logAudit({
    action: "COMPANY_ACTIVATED",
    companyId: id,
    reason,
    before: { status: company.status },
    after: { status: "ACTIVE" }
  })

  revalidatePath(`/app/admin/businesses/${id}`)
}

export async function archiveCompany(id: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to archive a company.")
  }

  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) throw new Error("Company not found")

  // Soft Delete / Archive
  await prisma.company.update({
    where: { id },
    data: { status: "ARCHIVED" }
  })

  await logAudit({
    action: "COMPANY_ARCHIVED",
    companyId: id,
    reason,
    before: { status: company.status },
    after: { status: "ARCHIVED" }
  })

  revalidatePath("/app/admin/businesses")
}

export async function changeCompanyPlan(companyId: string, planId: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to change a company plan.")
  }

  const sub = await prisma.subscription.findUnique({ where: { companyId } })
  const newPlan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!newPlan) throw new Error("Plan not found.")

  if (!sub) {
    await prisma.subscription.create({
      data: {
        companyId,
        planId,
        status: "active"
      }
    })
  } else {
    await prisma.subscription.update({
      where: { companyId },
      data: { planId }
    })
  }

  await logAudit({
    action: "PLAN_CHANGED_BY_ADMIN",
    companyId,
    reason,
    before: sub ? { planId: sub.planId } : null,
    after: { planId }
  })

  revalidatePath(`/app/admin/businesses/${companyId}`)
}

export async function grantAdminPlan(companyId: string, planId: string, durationDays: number | null, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to grant an admin plan.")
  }

  const session = await requireSuperAdmin() // get the current user for grantedBy

  const sub = await prisma.subscription.findUnique({ where: { companyId } })
  const newPlan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!newPlan) throw new Error("Plan not found.")

  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null

  if (!sub) {
    await prisma.subscription.create({
      data: {
        companyId,
        planId,
        status: "active",
        planSource: "ADMIN_GRANT",
        grantedBy: session.id,
        grantedAt: new Date(),
        expiresAt,
        grantReason: reason
      }
    })
  } else {
    await prisma.subscription.update({
      where: { companyId },
      data: { 
        planId,
        planSource: "ADMIN_GRANT",
        grantedBy: session.id,
        grantedAt: new Date(),
        expiresAt,
        previousPlanId: sub.planSource === "ADMIN_GRANT" ? sub.previousPlanId : sub.planId, // preserve original plan if already granted
        grantReason: reason
      }
    })
  }

  await logAudit({
    action: "ADMIN_PLAN_GRANTED",
    companyId,
    reason,
    before: sub ? { planId: sub.planId, source: sub.planSource } : null,
    after: { planId, source: "ADMIN_GRANT", expiresAt }
  })

  revalidatePath(`/app/admin/businesses/${companyId}`)
}

export async function revokeAdminPlan(companyId: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to revoke an admin plan.")
  }

  const sub = await prisma.subscription.findUnique({ where: { companyId } })
  if (!sub || sub.planSource !== "ADMIN_GRANT") {
    throw new Error("No active admin grant found.")
  }

  // If there's no previous plan, maybe fallback to free plan
  let fallbackPlanId = sub.previousPlanId
  if (!fallbackPlanId) {
    const freePlan = await prisma.plan.findFirst({ orderBy: { monthlyPrice: 'asc' } })
    if (freePlan) fallbackPlanId = freePlan.id
  }

  if (!fallbackPlanId) throw new Error("Could not determine fallback plan.")

  await prisma.subscription.update({
    where: { companyId },
    data: { 
      planId: fallbackPlanId,
      planSource: "SUBSCRIPTION",
      grantedBy: null,
      grantedAt: null,
      expiresAt: null,
      previousPlanId: null,
      grantReason: null
    }
  })

  await logAudit({
    action: "ADMIN_PLAN_REVOKED",
    companyId,
    reason,
    before: { planId: sub.planId, source: sub.planSource },
    after: { planId: fallbackPlanId, source: "SUBSCRIPTION" }
  })

  revalidatePath(`/app/admin/businesses/${companyId}`)
}

export async function cancelCompanySubscription(companyId: string, reason: string) {
  await requireSuperAdmin()
  await requireWriteAccess()

  if (!reason || reason.trim() === "") {
    throw new Error("A reason must be provided to cancel a subscription.")
  }

  const sub = await prisma.subscription.findUnique({ where: { companyId } })
  if (!sub) throw new Error("No active subscription found.")

  await prisma.subscription.update({
    where: { companyId },
    data: { status: "canceled" }
  })

  await logAudit({
    action: "COMPANY_SUBSCRIPTION_CANCELLED",
    companyId,
    reason,
    before: { status: sub.status },
    after: { status: "canceled" }
  })

  revalidatePath(`/app/admin/businesses/${companyId}`)
}
