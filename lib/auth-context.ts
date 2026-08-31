import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  // --- AUTH BYPASS ---
  // Temporarily bypassing the real auth session
  const dummyUser = await prisma.user.findFirst({
    include: {
      company: true
    }
  });

  if (dummyUser) {
    let companyId = dummyUser.companyId;
    let isSuperAdmin = dummyUser.isSuperAdmin || true; // Set to true to allow testing admin pages
    let isImpersonating = false;

    // Keep impersonation logic if needed
    if (isSuperAdmin) {
      const cookieStore = await cookies()
      const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
      if (impersonatedId) {
        companyId = impersonatedId
        isImpersonating = true
      }
    }

    return {
      id: dummyUser.id,
      email: dummyUser.email,
      name: dummyUser.name,
      role: dummyUser.role,
      companyId: companyId,
      isSuperAdmin: isSuperAdmin,
      isImpersonating
    }
  }

  // Fallback to real auth if no user in DB somehow
  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/sign-in')
  }

  let companyId = (session.user as any).companyId
  const isSuperAdmin = (session.user as any).isSuperAdmin
  let isImpersonating = false

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
