"use server"
import { checkFeatureLimit } from '@/lib/billing'

import prisma from "@/utils/prisma"
import { requireCompany, requireWriteAccess, requireSuperAdmin } from "@/lib/auth-context"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"
import crypto from "crypto"
import { sendEmail } from "@/app/actions/email"

export async function inviteTeamMember(email: string, customRoleId: string) {
  const { companyId } = await requireCompany()
  
  try {
    await requireWriteAccess()
  } catch (err: any) {
    return { error: err.message || 'Write operations are blocked during read-only impersonation.' }
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  if (!company) return { error: "Company not found" }

  const { allowed } = await checkFeatureLimit(companyId, 'team_member');
  if (!allowed) {
    return { error: 'You have reached your limit. Please upgrade your plan.' };
  }

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
  const inviteLink = `https://flow.siteradiant.co.in/invite?token=${token}`
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>You've been invited!</h2>
      <p>You have been invited to join a team on FlowRadiant.</p>
      <p>Click the link below to accept the invitation and set up your account:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>This link will expire in 7 days.</p>
    </div>
  `

  await sendEmail({
    to: email,
    subject: "Invitation to join FlowRadiant",
    html
  })

  await logAudit({ action: "INVITATION_EMAIL_SENT", targetId: invitation.id, metadata: { email } })
  await logAudit({ action: "INVITATION_CREATED", targetId: invitation.id, metadata: { email, customRoleId } })
  revalidatePath("/app/settings")
  
  return { success: true }
}

export async function resendInvitationEmail(id: string) {
  const { companyId } = await requireCompany()
  
  try {
    await requireWriteAccess()
  } catch (err: any) {
    return { error: err.message || 'Write operations are blocked during read-only impersonation.' }
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id, companyId, status: "PENDING" }
  })

  if (!invitation) {
    return { error: "Invitation not found or no longer pending." }
  }

  const inviteLink = `https://flow.siteradiant.co.in/invite?token=${invitation.token}`
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Reminder: You've been invited!</h2>
      <p>You have been invited to join a team on FlowRadiant.</p>
      <p>Click the link below to accept the invitation and set up your account:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <p>This link will expire in 7 days.</p>
    </div>
  `

  await sendEmail({
    to: invitation.email,
    subject: "Reminder: Invitation to join FlowRadiant",
    html
  })

  await logAudit({ action: "INVITATION_EMAIL_RESENT", targetId: invitation.id, metadata: { email: invitation.email } })
  revalidatePath("/app/settings")
  
  return { success: true }
}

export async function revokeInvitation(id: string) {
  const { companyId } = await requireCompany()
  
  try {
    await requireWriteAccess()
  } catch (err: any) {
    return { error: err.message || 'Write operations are blocked during read-only impersonation.' }
  }

  await prisma.invitation.delete({ where: { id, companyId } })
  revalidatePath("/app/settings")
  return { success: true }
}

export async function removeTeamMember(id: string) {
  const { companyId } = await requireCompany()
  
  try {
    await requireWriteAccess()
  } catch (err: any) {
    return { error: err.message || 'Write operations are blocked during read-only impersonation.' }
  }

  const targetUser = await prisma.user.findUnique({ where: { id, companyId } })
  if (!targetUser) return { error: 'User not found.' }
  
  if (targetUser.role === 'admin') {
    return { error: 'Cannot remove an Account Admin. The admin title must be handed over first.' }
  }

  await prisma.user.delete({ where: { id, companyId } })

  revalidatePath("/app/settings")
  return { success: true }
}

export async function updateTeamMemberRole(userId: string, customRoleId: string | null) {
  const { companyId } = await requireCompany()
  
  try {
    await requireWriteAccess()
  } catch (err: any) {
    return { error: err.message || 'Write operations are blocked during read-only impersonation.' }
  }

  await prisma.user.update({
    where: { id: userId, companyId },
    data: { customRoleId }
  })

  await logAudit({ action: "TEAM_ROLE_UPDATED", targetId: userId, metadata: { customRoleId } })
  revalidatePath("/app/settings")
  return { success: true }
}
