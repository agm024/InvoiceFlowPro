"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"

export async function createPlatformRole(data: { name: string, description: string, permissions: string[] }) {
  await requireSuperAdmin()

  if (!data.name) return { error: "Name is required" }

  const role = await prisma.platformRole.create({
    data: {
      name: data.name,
      description: data.description,
      permissions: JSON.stringify(data.permissions)
    }
  })

  await logAudit({ action: "PLATFORM_ROLE_CREATED", targetId: role.id, metadata: { name: role.name } })
  revalidatePath("/app/admin/users/roles")
  return { success: true, role }
}

export async function updatePlatformRole(id: string, data: { name: string, description: string, permissions: string[] }) {
  await requireSuperAdmin()

  if (!data.name) return { error: "Name is required" }

  const role = await prisma.platformRole.findUnique({ where: { id } })
  if (!role) return { error: "Role not found" }

  const updated = await prisma.platformRole.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      permissions: JSON.stringify(data.permissions)
    }
  })

  await logAudit({ action: "PLATFORM_ROLE_UPDATED", targetId: role.id, metadata: { name: updated.name } })
  revalidatePath("/app/admin/users/roles")
  return { success: true, role: updated }
}

export async function deletePlatformRole(id: string) {
  await requireSuperAdmin()

  const role = await prisma.platformRole.findUnique({ where: { id } })
  if (!role) return { error: "Role not found" }

  // Remove role from users before deleting
  await prisma.user.updateMany({
    where: { platformRoleId: id },
    data: { platformRoleId: null }
  })

  await prisma.platformRole.delete({ where: { id } })

  await logAudit({ action: "PLATFORM_ROLE_DELETED", targetId: id, metadata: { name: role.name } })
  revalidatePath("/app/admin/users/roles")
  return { success: true }
}
