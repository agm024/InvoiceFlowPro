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
  if (!sub) {
    // Create new subscription if none exists
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
    action: "COMPANY_PLAN_CHANGED",
    companyId,
    reason,
    metadata: { planId }
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
