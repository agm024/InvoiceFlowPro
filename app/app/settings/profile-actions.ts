'use server'

import prisma from '@/utils/prisma'
import { requireCompany, requireWriteAccess } from '@/lib/auth-context'
import bcrypt from 'bcryptjs'

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const { user } = await requireCompany()

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || !dbUser.passwordHash) {
    return { error: 'Invalid user or password not set (using Google Auth)' }
  }

  const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash)
  if (!isValid) {
    return { error: 'Current password is incorrect' }
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash }
  })

  return { success: true }
}

export async function deleteAccountAction() {
  await requireWriteAccess()
  const { user, companyId } = await requireCompany()

  // Verify they are the admin (or superadmin)
  // Actually, if it's their company and they are the owner, delete the whole company
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: true }
  })

  if (!company) return { error: 'Company not found' }

  if (company.subscription?.status === 'active') {
    return { error: 'Please cancel active subscription before deleting account' }
  }

  // Delete related models that don't have onDelete: Cascade
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany({ where: { companyId } })
    await tx.platformPayment.deleteMany({ where: { companyId } })
    await tx.invitation.deleteMany({ where: { companyId } })
    
    // Delete the entire company - this will cascade and delete invoices, clients, etc.
    await tx.company.delete({
      where: { id: companyId }
    })
  })

  return { success: true }
}
