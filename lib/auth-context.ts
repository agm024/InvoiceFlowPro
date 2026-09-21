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

  // Fetch latest user details including custom role for permissions
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id || "" },
    include: { customRole: true }
  })
  
  let permissions: string[] = []
  if (dbUser?.role === 'admin') {
    permissions = ['ALL']
  } else if (dbUser?.customRole) {
    try {
      permissions = JSON.parse(dbUser.customRole.permissions || '[]')
    } catch (e) {
      permissions = []
    }
  }

  return {
    id: session.user.id || "",
    email: session.user.email,
    name: session.user.name,
    role: dbUser?.role || (session.user as any).role,
    companyId,
    isSuperAdmin,
    isImpersonating,
    writeAllowed,
    permissions
  }
}

export async function requireCompany() {
  const user = await getCurrentUser()
  
  if (!user.companyId) {
    redirect('/onboarding')
  }

  const company = await prisma.company.findUnique({ where: { id: user.companyId } });
  if (company?.status === 'SUSPENDED') {
    redirect('/suspended');
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
  if (user.role === 'member') {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, include: { customRole: true } });
    if (!dbUser || !dbUser.customRole || dbUser.customRole.permissions === '[]' || !dbUser.customRole.permissions) {
      throw new Error('You do not have write access. Contact your administrator.');
    }
  }
}

export async function requireRBAC() {
  const { companyId } = await requireCompany()
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  })
  
  if (company?.subscription?.plan?.name === 'Free') {
    throw new Error('Role-Based Access Control (RBAC) is not available on the Free plan. Please upgrade to Pro.')
  }
}


