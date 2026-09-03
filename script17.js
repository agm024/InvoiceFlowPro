const fs = require('fs');
const content = `"use server"

import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"

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

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } })
  
  if (existingUser) {
    // If user exists, we might just link them, but in this schema, users are strictly tied to one company
    // For now, if user exists, they can't join another company unless we support multi-company.
    // If they already exist in this company, why invite them?
    if (existingUser.companyId !== invitation.companyId) {
      return { error: "This email is already registered to a different workspace." }
    }
  } else {
    // Create new user
    const passwordHash = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        email: invitation.email,
        name,
        passwordHash,
        companyId: invitation.companyId,
        role: "member",
        customRoleId: invitation.customRoleId
      }
    })
  }

  // Mark invitation as accepted
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "ACCEPTED" }
  })

  // Sign in the user automatically
  // This throws a NEXT_REDIRECT internally, which is caught by the client
  await signIn('credentials', {
    email: invitation.email,
    password,
    redirectTo: '/app'
  })
}
`;
fs.writeFileSync('app/invite/actions.ts', content, 'utf8');
