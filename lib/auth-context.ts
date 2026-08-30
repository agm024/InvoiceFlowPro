import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/sign-in')
  }

  let companyId = (session.user as any).companyId
  const isSuperAdmin = (session.user as any).isSuperAdmin
  let isImpersonating = false

  // Handle impersonation
  if (isSuperAdmin) {
    const cookieStore = await cookies()
    const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
    if (impersonatedId) {
      companyId = impersonatedId
      isImpersonating = true
    }
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role,
    companyId,
    isSuperAdmin,
    isImpersonating
  }
}

export async function requireCompany() {
  const user = await getCurrentUser()
  
  if (!user.companyId) {
    throw new Error('User is not associated with a company')
  }

  return {
    user,
    companyId: user.companyId
  }
}

export async function requireSuperAdmin() {
  const user = await getCurrentUser()

  if (!user.isSuperAdmin) {
    redirect('/app')
  }

  return user
}
