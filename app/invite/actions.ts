"use server"

import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { logAudit } from "@/lib/audit"

export async function checkInvitationAction(token: string) {
  const invitation = await prisma.invitation.findFirst({
    where: { token, status: "PENDING" }
  })

  if (!invitation) {
    return { error: "This invitation is invalid or has already been accepted." }
  }

  if (invitation.expiresAt < new Date()) {
    return { error: "This invitation has expired." }
  }

  return { success: true, email: invitation.email }
}

export async function acceptInvitationAction(token: string, name: string, password: string) {
  if (!name || password.length < 8) {
    return { error: "Name and password (min 8 chars) are required." }
  }

  const invitation = await prisma.invitation.findFirst({
    where: { token, status: "PENDING" }
  })

  if (!invitation) {
    return { error: "This invitation is invalid or has already been accepted." }
  }

  if (invitation.expiresAt < new Date()) {
    return { error: "This invitation has expired." }
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } })
  
  if (existingUser) {
    if (existingUser.companyId !== invitation.companyId) {
      return { error: "This email is already registered to a different workspace." }
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Update existing user role based on invitation and update their password
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        passwordHash,
        name,
        role: "member", // never default to admin
        customRoleId: (invitation.customRoleId || undefined) as string | undefined
      }
    });
  } else {
    // Create new user
    const passwordHash = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        email: invitation.email,
        name,
        passwordHash,
        companyId: invitation.companyId!,
        role: "member",
        customRoleId: (invitation.customRoleId || undefined) as string | undefined
      }
    })
  }

  // Mark invitation as accepted
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "ACCEPTED" }
  })

  await logAudit({
    action: 'INVITATION_ACCEPTED',
    targetId: invitation.id,
    companyId: invitation.companyId || undefined,
    metadata: {
      email: invitation.email,
      roleAssigned: invitation.customRoleId || 'member'
    }
  })

  // Sign in the user automatically
  await signIn('credentials', {
    email: invitation.email,
    password,
    redirectTo: '/app'
  })
}
