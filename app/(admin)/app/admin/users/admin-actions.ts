"use server"

import prisma from "@/utils/prisma"
import { requireSuperAdmin } from "@/lib/auth-context"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"
import crypto from "crypto"
import { sendEmail } from "@/app/actions/email"

export async function inviteSuperAdmin(email: string, platformRoleId: string) {
  await requireSuperAdmin()

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser && existingUser.isSuperAdmin) {
    return { error: "User is already a Super Admin" }
  }

  const existingInvite = await prisma.invitation.findFirst({ where: { email, platformRoleId: { not: null }, status: "PENDING" } })
  if (existingInvite) {
    return { error: "A super-admin invitation is already pending for this email" }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const invitation = await prisma.invitation.create({
    data: {
      email,
      platformRoleId,
      token,
      invitedBy: "System Administrator",
      expiresAt
    }
  })

  // Send Email
  const inviteLink = `https://invoice.siteradiant.co.in/admin-invite?token=${token}`
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Admin Invitation</h2>
      <p>You have been invited to join the System Administration team on InvoiceFlowPro.</p>
      <p>Click the link below to securely accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Accept Admin Invitation</a>
      <p>This link will expire in 7 days.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: "Admin Invitation for InvoiceFlowPro",
    html
  })

  await logAudit({ action: "ADMIN_INVITE_SENT", targetId: invitation.id, metadata: { email } })
  revalidatePath("/app/admin/users")
  
  return { success: true }
}

export async function revokeAdminInvitation(id: string) {
  await requireSuperAdmin()

  await prisma.invitation.delete({ where: { id } })
  revalidatePath("/app/admin/users")
  return { success: true }
}
