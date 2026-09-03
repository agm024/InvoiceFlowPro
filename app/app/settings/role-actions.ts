"use server"

import prisma from "@/utils/prisma"
import { requireCompany, requireWriteAccess } from "@/lib/auth-context"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"

export async function createRole(data: { name: string, description: string, permissions: string[] }) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  if (!data.name) return { error: "Name is required" }

  const role = await prisma.customRole.create({
    data: {
      name: data.name,
      description: data.description,
      permissions: JSON.stringify(data.permissions),
      companyId
    }
  })

  await logAudit({ action: "ROLE_CREATED", targetId: role.id, metadata: { name: role.name } })
  revalidatePath("/app/settings")
  return { success: true, role }
}

export async function updateRole(id: string, data: { name: string, description: string, permissions: string[] }) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  if (!data.name) return { error: "Name is required" }

  const role = await prisma.customRole.findFirst({ where: { id, companyId } })
  if (!role) return { error: "Role not found" }

  const updated = await prisma.customRole.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      permissions: JSON.stringify(data.permissions)
    }
  })

  await logAudit({ action: "ROLE_UPDATED", targetId: role.id, metadata: { name: updated.name } })
  revalidatePath("/app/settings")
  return { success: true, role: updated }
}

export async function deleteRole(id: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  const role = await prisma.customRole.findFirst({ where: { id, companyId } })
  if (!role) return { error: "Role not found" }

  // Remove role from users before deleting
  await prisma.user.updateMany({
    where: { customRoleId: id, companyId },
    data: { customRoleId: null }
  })

  await prisma.customRole.delete({ where: { id } })

  await logAudit({ action: "ROLE_DELETED", targetId: id, metadata: { name: role.name } })
  revalidatePath("/app/settings")
  return { success: true }
}
