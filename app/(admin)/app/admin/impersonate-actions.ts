'use server'

import { requireSuperAdmin } from '@/lib/auth-context'
import { logAudit } from '@/lib/audit'
import prisma from '@/utils/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function impersonateCompany(companyId: string, reason: string, allowWrite: boolean = false) {
  const admin = await requireSuperAdmin()
  
  if (!reason || reason.trim() === "") {
    throw new Error('An explicit reason is required to start impersonation.')
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { name: true, supportAccessGranted: true }
  })

  if (!company?.supportAccessGranted) {
    throw new Error('This company has not granted support access.')
  }

  await logAudit({
    action: 'IMPERSONATE_COMPANY_START',
    companyId,
    reason: reason,
    metadata: { 
      adminEmail: admin.email,
      companyName: company.name,
      writeEnabled: allowWrite 
    }
  })

  const cookieStore = await cookies()
  cookieStore.set('impersonatedCompanyId', companyId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  if (allowWrite) {
    cookieStore.set('impersonateWriteEnabled', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })
  } else {
    cookieStore.delete('impersonateWriteEnabled')
  }

  redirect('/app')
}

export async function stopImpersonation() {
  const admin = await requireSuperAdmin()
  const cookieStore = await cookies()
  const impersonatedId = cookieStore.get('impersonatedCompanyId')?.value
  
  if (impersonatedId) {
    await logAudit({
      action: 'IMPERSONATE_COMPANY_STOP',
      companyId: impersonatedId,
      reason: 'Session ended by administrator'
    })
    cookieStore.delete('impersonatedCompanyId')
    cookieStore.delete('impersonateWriteEnabled')
  }

  redirect('/app/admin/businesses')
}
