"use server"

import prisma from "@/utils/prisma"
import { requireCompany, requireWriteAccess, requireSuperAdmin } from "@/lib/auth-context"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"
import crypto from "crypto"
import { sendEmail } from "@/app/actions/email"

export async function inviteTeamMember(email: string, customRoleId: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser && existingUser.companyId === companyId) {
    return { error: "User is already in your team" }
  }

  const existingInvite = await prisma.invitation.findFirst({ where: { email, companyId, status: "PENDING" } })
  if (existingInvite) {
    return { error: "An invitation is already pending for this email" }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const inviter = await prisma.user.findFirst({ where: { companyId } })

  const invitation = await prisma.invitation.create({
    data: {
      email,
      companyId,
      customRoleId,
      token,
      invitedBy: inviter?.email || "Admin",
      expiresAt
    }
  })

  // Send Email
  const inviteLink = `https://invoice.siteradiant.co.in/invite?token=${token}`
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>You've been invited!</h2>
      <p>You have been invited to join a team on InvoiceFlowPro.</p>
      <p>Click the link below to accept the invitation and set up your account:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>This link will expire in 7 days.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: "Invitation to join InvoiceFlowPro",
    html
  })

  await logAudit({ action: "TEAM_INVITE_SENT", targetId: invitation.id, metadata: { email } })
  revalidatePath("/app/settings")
  
  return { success: true }
}

export async function revokeInvitation(id: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  await prisma.invitation.delete({ where: { id, companyId } })
  revalidatePath("/app/settings")
  return { success: true }
}

export async function removeTeamMember(id: string) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  // We don't delete the user, we could just remove their customRole or set them to a detached state
  // But since user must belong to a company in this schema, we might just delete them or remove role
  // Let's just remove the role for now so they have no permissions, or delete the user record if they only belong here.
  // We'll just remove the customRole and set role to 'member'
  await prisma.user.update({
    where: { id, companyId },
    data: { customRoleId: null, role: 'member' }
  })

  revalidatePath("/app/settings")
  return { success: true }
}

export async function updateTeamMemberRole(userId: string, customRoleId: string | null) {
  const { companyId } = await requireCompany()
  await requireWriteAccess()

  await prisma.user.update({
    where: { id: userId, companyId },
    data: { customRoleId }
  })

  await logAudit({ action: "TEAM_ROLE_UPDATED", targetId: userId, metadata: { customRoleId } })
  revalidatePath("/app/settings")
  return { success: true }
}
