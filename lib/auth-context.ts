import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

const BYPASS_AUTH = true

export async function getCurrentUser() {
  if (BYPASS_AUTH) {
    const dummyUser = await prisma.user.findFirst({
      include: {
        company: true
      }
    });

    if (dummyUser) {
      let companyId = dummyUser.companyId;
      let isSuperAdmin = dummyUser.isSuperAdmin || true;
      let isImpersonating = false;
      let writeAllowed = false;

      if (isSuperAdmin) {
        const cookieStore = await cookies()
        const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
        if (impersonatedId) {
          companyId = impersonatedId
          isImpersonating = true
          writeAllowed = cookieStore.get('impersonateWriteEnabled')?.value === 'true'
        }
      }

      return {
        id: dummyUser.id,
        email: dummyUser.email,
        name: dummyUser.name,
        role: dummyUser.role,
        companyId,
        isSuperAdmin,
        isImpersonating,
        writeAllowed
      }
    }
  }

  const session = await auth()
  
  if (!session || !session.user) {
    redirect('/sign-in')
  }

  let companyId = (session.user as any).companyId
  const isSuperAdmin = (session.user as any).isSuperAdmin
  let isImpersonating = false
  let writeAllowed = false

  // Handle impersonation
  if (isSuperAdmin) {
    const cookieStore = await cookies()
    const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
    if (impersonatedId) {
      companyId = impersonatedId
      isImpersonating = true
      writeAllowed = cookieStore.get('impersonateWriteEnabled')?.value === 'true'
    }
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: (session.user as any).role,
    companyId,
    isSuperAdmin,
    isImpersonating,
    writeAllowed
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

/**
 * Enforces that mutations cannot happen during an impersonation session
 * unless write access is explicitly requested and authorized.
 */
export async function requireWriteAccess() {
  const user = await getCurrentUser()
  if (user.isImpersonating && !user.writeAllowed) {
    throw new Error('Write operations are blocked during read-only impersonation.')
  }
}
